import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// ─── Types returned to the browser (public-safe only) ───────────────────────
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
  status: z.string().max(50).optional().default("all"),
  page: z.number().int().min(1).max(10_000).optional().default(1),
});

const PUBLIC_COLUMNS =
  "registration_no, name, english_name, team_club, events, status, admin_remark";

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
        // Phone match goes through phone_search server-side; never returned.
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

    // Strip to whitelisted shape (defensive).
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

// ─── Admin: CSV/TSV upload fallback ────────────────────────────────────────
const uploadInput = z.object({
  password: z.string().min(1).max(500),
  format: z.enum(["csv", "tsv"]),
  content: z.string().min(1).max(5_000_000), // ~5MB
});

function parseDelimited(text: string, delimiter: string): Record<string, string>[] {
  // Minimal RFC-4180-ish parser supporting quoted fields.
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
  const header = rows[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return rows.slice(1).filter((r) => r.some((v) => v.trim() !== "")).map((r) => {
    const obj: Record<string, string> = {};
    header.forEach((h, idx) => (obj[h] = (r[idx] ?? "").trim()));
    return obj;
  });
}

function digitsOnly(s: string | undefined | null): string {
  return (s ?? "").replace(/\D/g, "");
}

function splitEvents(s: string | undefined | null): string[] {
  if (!s) return [];
  return s
    .split(/[,;|]/)
    .map((x) => x.trim())
    .filter(Boolean);
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

    const delimiter = data.format === "tsv" ? "\t" : ",";
    const parsed = parseDelimited(data.content, delimiter);
    if (parsed.length === 0) {
      return { inserted: 0, errors: ["No rows found"] };
    }

    // Expected header keys (lowercased, underscored): registration_no, name, english_name,
    // team_club, events, status, admin_remark, phone, phone_search, raw_data
    const errors: string[] = [];
    const rowsToUpsert = parsed
      .map((r, idx) => {
        const reg = r.registration_no || r.reg_no || r.no;
        if (!reg) {
          errors.push(`Row ${idx + 2}: missing registration_no`);
          return null;
        }
        const phoneSource = r.phone_search || r.phone || "";
        return {
          registration_no: reg,
          name: r.name || null,
          english_name: r.english_name || r.english || null,
          team_club: r.team_club || r.team || r.club || null,
          events: splitEvents(r.events || r.event),
          status: r.status || null,
          admin_remark: r.admin_remark || r.remark || null,
          phone_search: digitsOnly(phoneSource) || null,
          raw_data: r as unknown,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    if (rowsToUpsert.length === 0) {
      return { inserted: 0, errors };
    }

    const { error, count } = await sb
      .from("registrations")
      .upsert(rowsToUpsert, { onConflict: "registration_no", count: "exact" });

    if (error) {
      console.error("[uploadRegistrationsCsv]", error);
      return { inserted: 0, errors: [...errors, error.message] };
    }
    return { inserted: count ?? rowsToUpsert.length, errors };
  });
