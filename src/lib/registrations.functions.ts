import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ─── Types returned to the browser (public-safe only) ───────────────────────
// NEVER add phone_search, raw_data, NRC, email, DOB, guardian, emergency
// contact, or UCI ID to this type.
export type PublicRegistration = {
  registration_no: string;
  name: string | null;
  english_name: string | null;
  team_club: string | null;
  events: string[] | null;
  status: string | null;
  admin_remark: string | null;
};

const PAGE_SIZE = 50;

const lookupInput = z.object({
  query: z.string().max(200).optional().default(""),
  event: z.string().max(50).optional().default("all"),
  status: z.string().max(80).optional().default("all"),
  page: z.number().int().min(1).max(10_000).optional().default(1),
});

// Whitelisted columns sent to the browser. phone_search / raw_data are
// intentionally excluded.
const PUBLIC_COLUMNS =
  "registration_no, name, english_name, team_club, events, status, admin_remark";

// ─── Phone normalization ────────────────────────────────────────────────────
// Strip non-digits. Produce a set of candidate forms so search works for
// users typing local (09xxxxxxxx) or international (959xxxxxxxx / +959...).
export function normalizePhone(raw: string | null | undefined): string {
  const d = (raw ?? "").replace(/\D/g, "");
  if (!d) return "";
  // Canonical: if starts with 95 + 9 (Myanmar mobile), keep as-is.
  // If starts with 9 (no country code), prepend 0 -> 09...
  // If starts with 09, keep.
  // Always store both local and intl variants joined by '|' for partial match.
  const variants = new Set<string>();
  variants.add(d);
  if (d.startsWith("95")) {
    // 959xxxxxxxx -> local 09xxxxxxxx
    const rest = d.slice(2);
    if (rest.startsWith("9")) variants.add("0" + rest);
  } else if (d.startsWith("09")) {
    // local -> intl 959xxxxxxxx
    variants.add("95" + d.slice(1));
  } else if (d.startsWith("9")) {
    // bare 9xxxxxxxx -> 09xxxxxxxx and 959xxxxxxxx
    variants.add("0" + d);
    variants.add("95" + d);
  }
  return Array.from(variants).join("|");
}

// ─── Public lookup (server-only DB access, RLS bypassed via service role) ──
export const lookupRegistration = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => lookupInput.parse(raw))
  .handler(async ({ data }) => {
    const { extAdmin } = await import("@/integrations/ext-supabase/admin.server");
    const sb = extAdmin();

    let q = sb
      .from("registrations")
      .select(PUBLIC_COLUMNS, { count: "exact" })
      .order("registration_no", { ascending: true });

    if (data.event && data.event !== "all") {
      q = q.contains("events", [data.event]);
    }
    if (data.status && data.status !== "all") {
      q = q.eq("status", data.status);
    }

    const query = data.query.trim();
    if (query) {
      const digits = query.replace(/\D/g, "");
      if (digits.length >= 4) {
        // Phone search runs server-side against phone_search; never returned.
        q = q.ilike("phone_search", `%${digits}%`);
      } else {
        const safe = query.replace(/[%,()]/g, " ");
        q = q.or(
          [
            `registration_no.ilike.%${safe}%`,
            `name.ilike.%${safe}%`,
            `english_name.ilike.%${safe}%`,
            `team_club.ilike.%${safe}%`,
          ].join(","),
        );
      }
    }

    const from = (data.page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    const { data: rows, count, error } = await q.range(from, to);

    if (error) {
      console.error("[lookupRegistration]", error);
      return { rows: [] as PublicRegistration[], total: 0, page: data.page, pageSize: PAGE_SIZE };
    }

    // Defensive: strip to whitelisted shape.
    const safe: PublicRegistration[] = (rows ?? []).map((r: any) => ({
      registration_no: r.registration_no,
      name: r.name ?? null,
      english_name: r.english_name ?? null,
      team_club: r.team_club ?? null,
      events: Array.isArray(r.events) ? r.events : null,
      status: r.status ?? null,
      admin_remark: r.admin_remark ?? null,
    }));

    return { rows: safe, total: count ?? 0, page: data.page, pageSize: PAGE_SIZE };
  });

// ─── Admin: CSV/TSV/TXT upload ─────────────────────────────────────────────
const uploadInput = z.object({
  password: z.string().min(1).max(500),
  content: z.string().min(1).max(5_000_000), // ~5MB
});

function parseDelimited(text: string, delimiter: string): Record<string, string>[] {
  // RFC-4180-ish parser supporting quoted fields.
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === delimiter) {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (c === "\r") {
        // skip; \n will terminate
      } else {
        field += c;
      }
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (rows.length === 0) return [];
  // Strip BOM from first header cell, then trim all headers.
  const rawHeader = rows[0];
  if (rawHeader.length > 0) {
    rawHeader[0] = rawHeader[0].replace(/^\uFEFF/, "");
  }
  const header = rawHeader.map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.some((v) => v.trim() !== ""))
    .map((r) => {
      const obj: Record<string, string> = {};
      header.forEach((h, idx) => (obj[h] = (r[idx] ?? "").trim()));
      return obj;
    });
}

function splitEvents(s: string | undefined | null): string[] {
  if (!s) return [];
  return s
    .split(/[,;|/]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

// Look up a value by any of the candidate header names.
// Matches when the header (left of '|', case/space-insensitive) equals,
// starts with, or contains the candidate. This handles bilingual Google Form
// headers like "Full Name in Myanmar |အမည်အပြည့်အစုံ".
function pick(r: Record<string, string>, ...names: string[]): string {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const entries = Object.keys(r).map((k) => {
    const left = k.split("|")[0];
    return { key: k, normLeft: norm(left), normFull: norm(k) };
  });
  for (const n of names) {
    const nn = norm(n);
    // 1) exact left-of-pipe
    let hit = entries.find((e) => e.normLeft === nn);
    // 2) left-of-pipe starts with candidate
    if (!hit) hit = entries.find((e) => e.normLeft.startsWith(nn));
    // 3) full header starts with candidate
    if (!hit) hit = entries.find((e) => e.normFull.startsWith(nn));
    // 4) full header includes candidate
    if (!hit) hit = entries.find((e) => e.normFull.includes(nn));
    if (hit) {
      const v = r[hit.key];
      if (v !== undefined && v !== "") return v;
    }
  }
  return "";
}

export const uploadRegistrationsCsv = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => uploadInput.parse(raw))
  .handler(async ({ data }) => {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword || data.password !== adminPassword) {
      throw new Error("Unauthorized");
    }

    const { extAdmin } = await import("@/integrations/ext-supabase/admin.server");
    const sb = extAdmin();

    // Strip BOM for detection purposes.
    const text = data.content.replace(/^\uFEFF/, "");
    const firstLineEnd = text.indexOf("\n");
    const firstLine = firstLineEnd === -1 ? text : text.slice(0, firstLineEnd);
    const delimiter = firstLine.includes("\t") ? "\t" : ",";

    const parsed = parseDelimited(data.content, delimiter);
    if (parsed.length === 0) {
      return { inserted: 0, errors: ["No rows found"], delimiter };
    }

    const errors: string[] = [];
    const defaultStatus = "Registration received - pending MCF verification";

    const rowsToUpsert = parsed.map((r, idx) => {
      // Public-form headers
      let reg = pick(r, "registration_no", "reg_no", "no");
      let name = pick(r, "name", "Full Name in Myanmar");
      let english = pick(r, "english_name", "english", "Full Name in English");
      let team = pick(
        r,
        "team_club",
        "team",
        "club",
        "Team / Club / State / Region Name",
      );
      let events = pick(r, "events", "event", "Events Entered");
      let status = pick(r, "status");
      let remark = pick(r, "admin_remark", "remark");
      let phone = pick(r, "phone_search", "phone", "Phone / Viber");
      let timestamp = pick(r, "first_received", "Timestamp");

      if (!reg) {
        const seq = String(idx + 1).padStart(4, "0");
        reg = `NC26-${seq}`;
      }
      if (!team) team = "Independent Rider";
      if (!status) status = defaultStatus;

      const row: Record<string, unknown> = {
        registration_no: reg,
        name: name || null,
        english_name: english || null,
        team_club: team,
        events: splitEvents(events),
        status,
        admin_remark: remark || null,
        phone_search: normalizePhone(phone) || null,
        // raw_data intentionally omitted: raw Google Form rows may contain
        // private fields (NRC, email, DOB, guardian, emergency contact, UCI
        // ID). Only normalized public-safe fields are stored.
      };
      if (timestamp) row.first_received = timestamp;
      return row;
    });

    if (rowsToUpsert.length === 0) {
      return { inserted: 0, errors, delimiter };
    }

    const { error, count } = await sb
      .from("registrations")
      .upsert(rowsToUpsert, { onConflict: "registration_no", count: "exact" });

    if (error) {
      console.error("[uploadRegistrationsCsv]", error);
      return { inserted: 0, errors: [...errors, error.message], delimiter };
    }
    return { inserted: count ?? rowsToUpsert.length, errors, delimiter };
  });
