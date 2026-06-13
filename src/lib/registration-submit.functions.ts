// Public submit endpoint for the MCF /register form.
// Append-mode: continues NC26 numbering from the existing public.registrations
// table (currently up to NC26-0164). First Lovable submission = NC26-0165.
//
// Two Supabase projects are touched:
//   - INTERNAL (Lovable Cloud, supabaseAdmin) → private registration_submissions
//   - EXTERNAL (extAdmin)                      → public-safe row in registrations
//
// Both clients are imported INSIDE the handler so the service-role modules
// never reach the client bundle.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { normalizePhone } from "@/lib/registrations.functions";

const STATES = [
  "Kachin", "Kayah", "Kayin", "Chin", "Mon", "Rakhine", "Shan",
  "Sagaing", "Tanintharyi", "Bago", "Magway", "Mandalay", "Yangon", "Ayeyarwady",
  "Naypyidaw", "Other",
] as const;

const EVENTS = ["Road Race", "Criterium", "MTB XCO"] as const;
const RACE_DATE = new Date("2026-06-26");

const submitSchema = z.object({
  rider_type: z.enum(["Team", "Region", "Club", "Independent"]),
  team_club: z.string().max(200).optional().default(""),
  manager_name: z.string().max(200).optional().default(""),
  manager_phone: z.string().max(50).optional().default(""),
  coach_name: z.string().max(200).optional().default(""),

  name_my: z.string().min(1).max(200),
  name_en: z.string().min(1).max(200),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.enum(["Male", "Female"]),
  nationality: z.string().min(1).max(80),
  nrc_or_passport: z.string().min(1).max(80),
  phone: z.string().min(5).max(50),
  email: z.string().email().max(200).optional().or(z.literal("")).default(""),
  township: z.string().min(1).max(120),
  state_region: z.enum(STATES),
  height_cm: z.number().min(80).max(250).optional().nullable(),
  weight_kg: z.number().min(20).max(200).optional().nullable(),

  emergency_name: z.string().min(1).max(200),
  emergency_phone: z.string().min(5).max(50),

  guardian_name: z.string().max(200).optional().default(""),
  guardian_relationship: z.string().max(80).optional().default(""),
  guardian_phone: z.string().max(50).optional().default(""),
  guardian_nrc: z.string().max(80).optional().default(""),
  guardian_consent: z.boolean().optional().default(false),
  guardian_signature: z.string().max(200).optional().default(""),

  events: z.array(z.enum(EVENTS)).min(1),

  uci_status: z.enum(["yes", "no"]),
  uci_id: z.string().max(80).optional().default(""),
  uci_ack: z.boolean(),

  rfid_ack: z.boolean(),

  consent_media: z.boolean(),
  consent_data: z.boolean(),
  consent_medical: z.boolean(),
  consent_safety: z.boolean(),
  consent_rules: z.boolean(),
  consent_disqualification: z.boolean(),
  consent_antidoping: z.boolean(),

  submitter_name: z.string().min(1).max(200),
  typed_signature: z.string().min(1).max(200),
});

function computeAgeOnRaceDay(dobIso: string): number {
  const dob = new Date(dobIso);
  let age = RACE_DATE.getFullYear() - dob.getFullYear();
  const m = RACE_DATE.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && RACE_DATE.getDate() < dob.getDate())) age--;
  return age;
}

function computeCategory(age: number, gender: "Male" | "Female"): string {
  const prefix = gender === "Female" ? "Women" : "Men";
  if (age < 18) return `${prefix} Junior`;
  if (age < 40) return `${prefix} Elite`;
  return `${prefix} Master`;
}

function pad4(n: number): string {
  return String(n).padStart(4, "0");
}

function suffixOf(regNo: string | null | undefined): number {
  if (!regNo) return 0;
  const m = /^NC26-(\d+)$/.exec(regNo);
  return m ? parseInt(m[1], 10) : 0;
}

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => submitSchema.parse(raw))
  .handler(async ({ data }) => {
    const { extAdmin } = await import("@/integrations/ext-supabase/admin.server");
    const { getRequestHeader } = await import("@tanstack/react-start/server");

    const ext = extAdmin();


    // Server-side validation: guardian required for under-18, UCI ID when uci_status=yes
    const age = computeAgeOnRaceDay(data.dob);
    if (age < 18) {
      if (!data.guardian_name || !data.guardian_phone || !data.guardian_consent || !data.guardian_signature) {
        throw new Error("Guardian consent is required for riders under 18.");
      }
    }
    if (data.rider_type !== "Independent" && !data.team_club.trim()) {
      throw new Error("Team / Club / Region name is required.");
    }
    if (data.uci_status === "yes" && !data.uci_id.trim()) {
      throw new Error("UCI ID is required when you have one.");
    }
    const allConsents =
      data.uci_ack && data.rfid_ack && data.consent_media && data.consent_data &&
      data.consent_medical && data.consent_safety && data.consent_rules &&
      data.consent_disqualification && data.consent_antidoping;
    if (!allConsents) throw new Error("All consents must be acknowledged.");

    const category = computeCategory(age, data.gender);

    // Best-effort IP hash (Cloudflare/Workers / general)
    const ipRaw =
      getRequestHeader("cf-connecting-ip") ||
      getRequestHeader("x-forwarded-for")?.split(",")[0].trim() ||
      "";
    const ip_hash = ipRaw ? await sha256Hex(ipRaw) : null;
    const user_agent = getRequestHeader("user-agent") ?? null;

    // ─── Compute next NC26 number from BOTH tables, max(known,164)+1 ────────
    async function nextNumber(): Promise<number> {
      const [extRes, intRes] = await Promise.all([
        ext.from("registrations")
          .select("registration_no")
          .like("registration_no", "NC26-%")
          .order("registration_no", { ascending: false })
          .limit(1),
        internal.from("registration_submissions")
          .select("registration_no")
          .like("registration_no", "NC26-%")
          .order("registration_no", { ascending: false })
          .limit(1),
      ]);
      const extMax = suffixOf(extRes.data?.[0]?.registration_no);
      const intMax = suffixOf(intRes.data?.[0]?.registration_no);
      return Math.max(extMax, intMax, 164) + 1;
    }

    // ─── Duplicate flagging (no auto-merge) ───────────────────────────────
    const phoneSearch = normalizePhone(data.phone);
    const possible_duplicate_of: string[] = [];
    if (phoneSearch) {
      const { data: dupPhone } = await ext
        .from("registrations")
        .select("registration_no")
        .ilike("phone_search", `%${data.phone.replace(/\D/g, "")}%`)
        .limit(5);
      for (const r of dupPhone ?? []) possible_duplicate_of.push(r.registration_no);
    }
    {
      const { data: dupName } = await ext
        .from("registrations")
        .select("registration_no")
        .or(`english_name.ilike.${data.name_en},name.ilike.${data.name_my}`)
        .limit(5);
      for (const r of dupName ?? []) {
        if (!possible_duplicate_of.includes(r.registration_no)) {
          possible_duplicate_of.push(r.registration_no);
        }
      }
    }

    const ageReview = data.gender === "Male" && age < 15; // boundary review
    const adminRemarkParts: string[] = [];
    if (possible_duplicate_of.length) adminRemarkParts.push("Possible duplicate — MCF review");
    if (ageReview) adminRemarkParts.push("Age/category requires MCF review");
    const adminRemark = adminRemarkParts.join(" · ") || null;

    // ─── Insert private row, retry on unique conflict ─────────────────────
    let registration_no = "";
    let lastErr: unknown = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      const n = await nextNumber();
      const candidate = `NC26-${pad4(n)}`;
      const { error } = await internal
        .from("registration_submissions")
        .insert({
          registration_no: candidate,
          rider_type: data.rider_type,
          team_club: data.team_club || null,
          manager_name: data.manager_name || null,
          manager_phone: data.manager_phone || null,
          coach_name: data.coach_name || null,
          name_my: data.name_my,
          name_en: data.name_en,
          dob: data.dob,
          gender: data.gender,
          nationality: data.nationality,
          nrc_or_passport: data.nrc_or_passport,
          phone: data.phone,
          email: data.email || null,
          township: data.township,
          state_region: data.state_region,
          height_cm: data.height_cm ?? null,
          weight_kg: data.weight_kg ?? null,
          emergency_name: data.emergency_name,
          emergency_phone: data.emergency_phone,
          guardian_name: data.guardian_name || null,
          guardian_relationship: data.guardian_relationship || null,
          guardian_phone: data.guardian_phone || null,
          guardian_nrc: data.guardian_nrc || null,
          guardian_consent: data.guardian_consent,
          guardian_signature: data.guardian_signature || null,
          computed_category: category,
          events: data.events,
          uci_status: data.uci_status,
          uci_id: data.uci_id || null,
          uci_ack: data.uci_ack,
          rfid_ack: data.rfid_ack,
          consent_media: data.consent_media,
          consent_data: data.consent_data,
          consent_medical: data.consent_medical,
          consent_safety: data.consent_safety,
          consent_rules: data.consent_rules,
          consent_disqualification: data.consent_disqualification,
          consent_antidoping: data.consent_antidoping,
          submitter_name: data.submitter_name,
          typed_signature: data.typed_signature,
          user_agent,
          ip_hash,
          possible_duplicate_of: possible_duplicate_of.length ? possible_duplicate_of : null,
        });
      if (!error) {
        registration_no = candidate;
        break;
      }
      lastErr = error;
      // unique violation → retry; other errors → break
      if (!(error.code === "23505" || /duplicate key/i.test(error.message))) break;
    }
    if (!registration_no) {
      console.error("[submitRegistration] private insert failed", lastErr);
      throw new Error("Could not save your registration. Please try again.");
    }

    // ─── Public-safe row into external registrations (upsert by reg_no) ───
    const teamClubPublic =
      data.rider_type === "Independent" ? "Independent Rider" : data.team_club;
    const publicRow = {
      registration_no,
      name: data.name_my,
      english_name: data.name_en,
      team_club: teamClubPublic,
      events: data.events,
      status: "Registration received - pending MCF verification",
      admin_remark: adminRemark,
      phone_search: phoneSearch || null,
      first_received: new Date().toISOString(),
    };
    const { error: pubErr } = await ext
      .from("registrations")
      .upsert(publicRow, { onConflict: "registration_no" });
    if (pubErr) {
      console.error("[submitRegistration] public upsert failed", pubErr);
      // Private row already saved with the NC26 number — surface but don't lose it.
      throw new Error(
        `Saved privately as ${registration_no} but public list update failed. Contact MCF.`,
      );
    }

    return { registration_no };
  });
