// Admin sync will be handled by a separate MCF admin project.
// This public project only displays registration status.
//
// Note: because the future admin panel will be a separate Lovable project,
// it cannot directly import this helper. It can copy/reuse the same logic,
// or we can later expose a protected sync endpoint from this project that
// the admin project calls over HTTPS.

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
  withCounts: z.boolean().optional().default(false),
});

// Public-safe aggregate counts. Numbers only — never any row data.
export type PublicCounts = {
  total: number;
  roadRace: number;
  criterium: number;
  mtbXco: number;
  pending: number;
};


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
  const variants = new Set<string>();
  variants.add(d);
  if (d.startsWith("95")) {
    const rest = d.slice(2);
    if (rest.startsWith("9")) variants.add("0" + rest);
  } else if (d.startsWith("09")) {
    variants.add("95" + d.slice(1));
  } else if (d.startsWith("9")) {
    variants.add("0" + d);
    variants.add("95" + d);
  }
  return Array.from(variants).join("|");
}

// ─── Public lookup (the ONLY server fn exposed to the browser) ─────────────
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
      return {
        rows: [] as PublicRegistration[],
        total: 0,
        page: data.page,
        pageSize: PAGE_SIZE,
        counts: null as PublicCounts | null,
      };
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

    // Optional public-safe aggregate counts. Numbers only.
    let counts: PublicCounts | null = null;
    if (data.withCounts) {
      const headOpts = { count: "exact" as const, head: true };
      const [tot, rr, cr, mtb, pend] = await Promise.all([
        sb.from("registrations").select("registration_no", headOpts),
        sb.from("registrations").select("registration_no", headOpts).contains("events", ["Road Race"]),
        sb.from("registrations").select("registration_no", headOpts).contains("events", ["Criterium"]),
        sb.from("registrations").select("registration_no", headOpts).contains("events", ["MTB XCO"]),
        sb
          .from("registrations")
          .select("registration_no", headOpts)
          .in("status", ["Registration received - pending MCF verification", "Pending"]),
      ]);
      counts = {
        total: tot.count ?? 0,
        roadRace: rr.count ?? 0,
        criterium: cr.count ?? 0,
        mtbXco: mtb.count ?? 0,
        pending: pend.count ?? 0,
      };
    }

    return { rows: safe, total: count ?? 0, page: data.page, pageSize: PAGE_SIZE, counts };
  });


// ─── Server-only sync helpers ───────────────────────────────────────────────
// Not a createServerFn, not exposed as a route. The future admin project
// will own ingestion; this code stays as reference / reusable logic.

function parseDelimited(text: string, delimiter: string): Record<string, string>[] {
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

// Bilingual-aware header lookup: handles "Full Name in Myanmar |အမည်...".
function pick(r: Record<string, string>, ...names: string[]): string {
  const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const entries = Object.keys(r).map((k) => {
    const left = k.split("|")[0];
    return { key: k, normLeft: norm(left), normFull: norm(k) };
  });
  for (const n of names) {
    const nn = norm(n);
    let hit = entries.find((e) => e.normLeft === nn);
    if (!hit) hit = entries.find((e) => e.normLeft.startsWith(nn));
    if (!hit) hit = entries.find((e) => e.normFull.startsWith(nn));
    if (!hit) hit = entries.find((e) => e.normFull.includes(nn));
    if (hit) {
      const v = r[hit.key];
      if (v !== undefined && v !== "") return v;
    }
  }
  return "";
}

export type NormalizedRegistration = {
  registration_no: string;
  name: string | null;
  english_name: string | null;
  team_club: string;
  events: string[];
  status: string;
  admin_remark: string | null;
  phone_search: string | null;
  first_received?: string;
};

const DEFAULT_STATUS = "Registration received - pending MCF verification";

// Pure helper: parsed header→value records → normalized DB rows.
// Raw Google Form rows may carry private fields (NRC, email, DOB, guardian,
// emergency contact, UCI ID). Only public-safe normalized fields are kept;
// `raw_data` is intentionally NOT included.
export function normalizeGoogleSheetRows(
  rows: Record<string, string>[],
): NormalizedRegistration[] {
  return rows.map((r, idx) => {
    let reg = pick(r, "registration_no", "reg_no", "no");
    const name = pick(r, "name", "Full Name in Myanmar");
    const english = pick(r, "english_name", "english", "Full Name in English");
    let team = pick(
      r,
      "team_club",
      "team",
      "club",
      "Team / Club / State / Region Name",
    );
    const events = pick(r, "events", "event", "Events Entered");
    let status = pick(r, "status");
    const remark = pick(r, "admin_remark", "remark");
    const phone = pick(r, "phone_search", "phone", "Phone / Viber");
    const timestamp = pick(r, "first_received", "Timestamp");

    if (!reg) {
      const seq = String(idx + 1).padStart(4, "0");
      reg = `NC26-${seq}`;
    }
    if (!team) team = "Independent Rider";
    if (!status) status = DEFAULT_STATUS;

    const out: NormalizedRegistration = {
      registration_no: reg,
      name: name || null,
      english_name: english || null,
      team_club: team,
      events: splitEvents(events),
      status,
      admin_remark: remark || null,
      phone_search: normalizePhone(phone) || null,
    };
    if (timestamp) out.first_received = timestamp;
    return out;
  });
}

const DEFAULT_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/1i8u0t6P6_45BoLxWINIZBAP-FI8AUUeb01RGKvHtobo/export?format=csv&gid=0";

export type SyncResult = {
  inserted: number;
  errors: string[];
  headers: string[];
  sample: NormalizedRegistration | null;
};

// Server-side sync. NOT exposed via createServerFn or route. The future
// admin project can copy this logic or call a protected endpoint we add later.
export async function syncFromGoogleSheet(opts?: {
  csvUrl?: string;
  csvText?: string;
}): Promise<SyncResult> {
  let csv = opts?.csvText;
  if (!csv) {
    const url = opts?.csvUrl ?? DEFAULT_SHEET_CSV_URL;
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) {
      return {
        inserted: 0,
        errors: [`Failed to fetch sheet: HTTP ${res.status}`],
        headers: [],
        sample: null,
      };
    }
    csv = await res.text();
  }

  const text = csv.replace(/^\uFEFF/, "");
  const firstLineEnd = text.indexOf("\n");
  const firstLine = firstLineEnd === -1 ? text : text.slice(0, firstLineEnd);
  const delimiter = firstLine.includes("\t") ? "\t" : ",";

  const parsed = parseDelimited(csv, delimiter);
  const headers = parsed.length > 0 ? Object.keys(parsed[0]) : [];
  if (parsed.length === 0) {
    return { inserted: 0, errors: ["No rows found"], headers, sample: null };
  }

  const normalized = normalizeGoogleSheetRows(parsed);
  const sample = normalized[0] ?? null;

  // Dynamic import keeps the service-role admin client out of any
  // client-reachable import chain regardless of bundler graph tracing.
  const { extAdmin } = await import("@/integrations/ext-supabase/admin.server");
  const sb = extAdmin();

  const { error, count } = await sb
    .from("registrations")
    .upsert(normalized, { onConflict: "registration_no", count: "exact" });

  if (error) {
    console.error("[syncFromGoogleSheet]", error);
    return { inserted: 0, errors: [error.message], headers, sample };
  }
  return { inserted: count ?? normalized.length, errors: [], headers, sample };
}
