// Public read-only content server functions backed by the external Supabase
// project (the same one that powers /register).
//
// Every fn loads the admin client INSIDE the handler so the service-role
// module never leaks into the client bundle.
//
// All fns swallow "missing table" / "permission" errors and return empty
// arrays so the site renders the bilingual empty state until the MCF team
// creates and populates the tables.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type BilingualRow = Record<string, unknown>;

async function safeSelect<T = BilingualRow>(
  table: string,
  query: (q: any) => any,
): Promise<T[]> {
  try {
    const { extAdmin } = await import("@/integrations/ext-supabase/admin.server");
    const base = extAdmin().from(table).select("*");
    const { data, error } = await query(base);
    if (error) {
      // Table missing / not yet granted — degrade silently to empty
      if (
        error.code === "42P01" || // undefined_table
        error.code === "42501" || // insufficient privilege
        /relation .* does not exist/i.test(error.message ?? "") ||
        /permission denied/i.test(error.message ?? "")
      ) {
        return [];
      }
      console.error(`[site-content] ${table}`, error);
      return [];
    }
    return (data as T[]) ?? [];
  } catch (e) {
    console.error(`[site-content] ${table} threw`, e);
    return [];
  }
}

// ─── Press Releases ────────────────────────────────────────────────────────
export type PressRelease = {
  id: string;
  slug: string;
  published_at: string | null;
  cover_url: string | null;
  title_en: string | null;
  title_mm: string | null;
  summary_en: string | null;
  summary_mm: string | null;
  body_en: string | null;
  body_mm: string | null;
};

export const listPressReleases = createServerFn({ method: "GET" }).handler(
  async () =>
    safeSelect<PressRelease>("press_releases", (q) =>
      q.eq("is_published", true).order("published_at", { ascending: false }),
    ),
);

export const getPressRelease = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) => z.object({ slug: z.string() }).parse(raw))
  .handler(async ({ data }) => {
    const rows = await safeSelect<PressRelease>("press_releases", (q) =>
      q.eq("slug", data.slug).eq("is_published", true).limit(1),
    );
    return rows[0] ?? null;
  });

// ─── Notices ───────────────────────────────────────────────────────────────
export type Notice = {
  id: string;
  ref_no: string | null;
  issued_at: string | null;
  title_en: string | null;
  title_mm: string | null;
  body_en: string | null;
  body_mm: string | null;
  attachment_url: string | null;
};

export const listNotices = createServerFn({ method: "GET" }).handler(async () =>
  safeSelect<Notice>("notices", (q) =>
    q.eq("is_published", true).order("issued_at", { ascending: false }),
  ),
);

// ─── Events / Stages ───────────────────────────────────────────────────────
export type EventRow = {
  id: string;
  slug: string;
  name_en: string | null;
  name_mm: string | null;
  date: string | null;
  location_en: string | null;
  location_mm: string | null;
};

export type StageRow = {
  id: string;
  event_id: string;
  slug: string;
  name_en: string | null;
  name_mm: string | null;
  date: string | null;
  distance_km: number | null;
  category: string | null;
};

export const listEvents = createServerFn({ method: "GET" }).handler(async () =>
  safeSelect<EventRow>("events", (q) => q.order("date", { ascending: true })),
);

export const listStages = createServerFn({ method: "GET" }).handler(async () =>
  safeSelect<StageRow>("stages", (q) => q.order("date", { ascending: true })),
);

// ─── Start Lists / Results / Standings ─────────────────────────────────────
export type StartListRow = {
  id: string;
  stage_id: string;
  bib: number | null;
  registration_no: string | null;
  name_en: string | null;
  name_mm: string | null;
  team_club: string | null;
  category: string | null;
};

export type ResultRow = {
  id: string;
  stage_id: string;
  position: number | null;
  bib: number | null;
  registration_no: string | null;
  name_en: string | null;
  name_mm: string | null;
  team_club: string | null;
  time_ms: number | null;
  gap_ms: number | null;
  points: number | null;
  status: string | null;
};

export type StandingRow = {
  id: string;
  event_id: string;
  classification: string;
  position: number | null;
  bib: number | null;
  registration_no: string | null;
  name_en: string | null;
  name_mm: string | null;
  team_club: string | null;
  points_or_time_ms: number | null;
  gold: number | null;
  silver: number | null;
  bronze: number | null;
};

export const listStartLists = createServerFn({ method: "GET" }).handler(
  async () =>
    safeSelect<StartListRow>("start_lists", (q) =>
      q.order("bib", { ascending: true }),
    ),
);

export const listResults = createServerFn({ method: "GET" }).handler(async () =>
  safeSelect<ResultRow>("results", (q) =>
    q.order("position", { ascending: true }),
  ),
);

export const listStandings = createServerFn({ method: "GET" }).handler(
  async () =>
    safeSelect<StandingRow>("standings", (q) =>
      q.order("classification", { ascending: true }).order("position", { ascending: true }),
    ),
);

// ─── Teams (rosters) ───────────────────────────────────────────────────────
export type TeamMember = {
  id: string;
  registration_no: string | null;
  rider_name: string;
  name_mm: string | null;
  display_order: number;
};

export type Team = {
  id: string;
  name: string;
  short_code: string | null;
  status: "confirmed" | "provisional";
  display_order: number;
  members: TeamMember[];
};

type TeamRow = {
  id: string;
  name: string;
  short_code: string | null;
  status: string | null;
  display_order: number | null;
};

type TeamMemberRow = TeamMember & { team_id: string };

export const listTeams = createServerFn({ method: "GET" }).handler(
  async (): Promise<Team[]> => {
    const [teams, members] = await Promise.all([
      safeSelect<TeamRow>("teams", (q) =>
        q.order("display_order", { ascending: true }),
      ),
      safeSelect<TeamMemberRow>("team_members", (q) =>
        q.order("display_order", { ascending: true }),
      ),
    ]);
    const byTeam = new Map<string, TeamMember[]>();
    for (const m of members) {
      const arr = byTeam.get(m.team_id) ?? [];
      arr.push({
        id: m.id,
        registration_no: m.registration_no,
        rider_name: m.rider_name,
        name_mm: m.name_mm,
        display_order: m.display_order ?? 0,
      });
      byTeam.set(m.team_id, arr);
    }
    return teams.map((t) => ({
      id: t.id,
      name: t.name,
      short_code: t.short_code,
      status: t.status === "confirmed" ? "confirmed" : "provisional",
      display_order: t.display_order ?? 0,
      members: byTeam.get(t.id) ?? [],
    }));
  },
);

// ─── Confirmed riders (filtered view of public.registrations) ──────────────
// Public-safe columns only. Reuses the existing public registrations table;
// when admin marks a registration "Confirmed for provisional start list" or
// similar, it shows up here.
export type ConfirmedRider = {
  registration_no: string;
  name: string | null;
  english_name: string | null;
  team_club: string | null;
  events: string[] | null;
  status: string | null;
};

export const listConfirmedRiders = createServerFn({ method: "GET" }).handler(
  async () => {
    const rows = await safeSelect<ConfirmedRider>("registrations", (q) =>
      q
        .select(
          "registration_no, name, english_name, team_club, events, status",
        )
        .ilike("status", "%Confirmed%")
        .order("registration_no", { ascending: true }),
    );
    return rows;
  },
);

// ─── Site Settings (registration open switch) ──────────────────────────────
// Single-row table keyed by id=true. Fail-closed: any error → registration
// reported as closed so the form never accidentally renders.
export type SiteSettings = {
  registration_open: boolean;
  registration_closed_message_en: string;
  registration_closed_message_mm: string;
};

const CLOSED_DEFAULT: SiteSettings = {
  registration_open: false,
  registration_closed_message_en: "",
  registration_closed_message_mm: "",
};

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => {
    try {
      const { extAdmin } = await import("@/integrations/ext-supabase/admin.server");
      const { data, error } = await extAdmin()
        .from("site_settings")
        .select(
          "registration_open, registration_closed_message_en, registration_closed_message_mm",
        )
        .eq("id", true)
        .maybeSingle();
      if (error || !data) return CLOSED_DEFAULT;
      return {
        registration_open: data.registration_open === true,
        registration_closed_message_en: data.registration_closed_message_en ?? "",
        registration_closed_message_mm: data.registration_closed_message_mm ?? "",
      };
    } catch (e) {
      console.error("[site-content] site_settings threw", e);
      return CLOSED_DEFAULT;
    }
  },
);

// ─── Live Updates ──────────────────────────────────────────────────────────
export type LiveUpdate = {
  id: string;
  posted_at: string;
  category: "road_race" | "women" | "mtb" | "criterium" | "general";
  title_en: string | null;
  title_mm: string | null;
  body_en: string | null;
  body_mm: string | null;
  link_url: string | null;
};

export const getLiveUpdates = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) =>
    z.object({ limit: z.number().int().positive().max(200).optional() }).parse(raw ?? {}),
  )
  .handler(async ({ data }) =>
    safeSelect<LiveUpdate>("live_updates", (q) =>
      q
        .eq("is_published", true)
        .order("posted_at", { ascending: false })
        .limit(data.limit ?? 50),
    ),
  );

export const getRecentLiveUpdates = createServerFn({ method: "GET" }).handler(
  async () => {
    const since = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    return safeSelect<LiveUpdate>("live_updates", (q) =>
      q
        .eq("is_published", true)
        .gte("posted_at", since)
        .order("posted_at", { ascending: false })
        .limit(3),
    );
  },
);

// ─── Riders to Watch ───────────────────────────────────────────────────────
export type RiderToWatch = {
  id: string;
  slug: string;
  category: "men_elite" | "women" | "junior" | "past_champion" | "sea_games";
  display_order: number;
  name_en: string | null;
  name_mm: string | null;
  team_club: string | null;
  photo_url: string | null;
  bio_en: string | null;
  bio_mm: string | null;
  palmares_en: string[] | null;
  palmares_mm: string[] | null;
};

export const getRidersToWatch = createServerFn({ method: "GET" }).handler(
  async () =>
    safeSelect<RiderToWatch>("riders_to_watch", (q) =>
      q
        .eq("is_published", true)
        .order("category", { ascending: true })
        .order("display_order", { ascending: true })
        .order("name_en", { ascending: true }),
    ),
);

// ─── Result Comments (per-stage Facebook-style threads) ────────────────────
export type ResultComment = {
  id: string;
  created_at: string;
  category: string;
  parent_id: string | null;
  author_name: string;
  body: string;
  likes: number;
  is_hidden: boolean;
};

export const listResultComments = createServerFn({ method: "GET" })
  .inputValidator((raw: unknown) =>
    z.object({ category: z.string().min(1).max(120) }).parse(raw),
  )
  .handler(async ({ data }) =>
    safeSelect<ResultComment>("result_comments", (q) =>
      q
        .eq("category", data.category)
        .eq("is_hidden", false)
        .order("created_at", { ascending: true }),
    ),
  );

export const postResultComment = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) =>
    z
      .object({
        category: z.string().min(1).max(120),
        author_name: z.string().trim().min(1).max(60),
        body: z.string().trim().min(1).max(1000),
        parent_id: z.string().uuid().nullable().optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data }) => {
    try {
      const { extAdmin } = await import("@/integrations/ext-supabase/admin.server");
      const { data: row, error } = await extAdmin()
        .from("result_comments")
        .insert({
          category: data.category,
          author_name: data.author_name,
          body: data.body,
          parent_id: data.parent_id ?? null,
        })
        .select("id")
        .single();
      if (error) {
        console.error("[result_comments] insert", error);
        return { ok: false as const, error: error.message };
      }
      return { ok: true as const, id: (row as { id: string }).id };
    } catch (e) {
      console.error("[result_comments] insert threw", e);
      return { ok: false as const, error: "Could not post comment." };
    }
  });

export const likeResultComment = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) =>
    z.object({ id: z.string().uuid() }).parse(raw),
  )
  .handler(async ({ data }) => {
    try {
      const { extAdmin } = await import("@/integrations/ext-supabase/admin.server");
      const client = extAdmin();
      const { data: cur, error: readErr } = await client
        .from("result_comments")
        .select("likes")
        .eq("id", data.id)
        .maybeSingle();
      if (readErr || !cur) {
        return { ok: false as const, likes: 0 };
      }
      const next = ((cur as { likes: number | null }).likes ?? 0) + 1;
      const { error: updErr } = await client
        .from("result_comments")
        .update({ likes: next })
        .eq("id", data.id);
      if (updErr)
        return {
          ok: false as const,
          likes: (cur as { likes: number | null }).likes ?? 0,
        };
      return { ok: true as const, likes: next };
    } catch (e) {
      console.error("[result_comments] like threw", e);
      return { ok: false as const, likes: 0 };
    }
  });


