## PART A — Render Points & Team standings on `/results`

Edit `src/routes/results.tsx`:

1. In `TabContent`, replace the placeholder fall-through:
   - `tab === "points"` → render `<PointsStanding groups={groups} lang={lang} />`. Empty (no group has any row with `points != null`) → `<NoResultsYet />`.
   - `tab === "team"` → filter `standings` to `classification === "Team"`, sort by `position`. Empty → `<NoResultsYet />`. Otherwise render `<TeamStandingTable rows={...} lang={lang} />`.
   - Remove the dead `tab === "standings"` branch (the tab id is `points`/`team`/`medal`/etc., not `standings`).
   - Keep `medal`, `start-lists`, `provisional`, `notices` fallbacks as-is. Final `return` stays as the generic empty/placeholder for anything unhandled (Medal still has no data).

2. **Export `PODIUM` from `src/components/ResultsTable.tsx`** so the new standings tables can reuse the exact same tint/medal map (it is currently a module-local const). Change `const PODIUM` → `export const PODIUM`.

3. Add two small components in `src/components/StandingsTables.tsx`:
   - **`PointsStanding`**: maps over `groups`; per stage, filters `g.rows.filter(r => r.points != null)` sorted by `points` desc; renders one section per stage with `h2` from `stageTitle(g, lang)` and a table:
     - Columns: **Rank | Rider | Team / Club | Points**.
     - Rank = 1-based index within the filtered stage list.
     - Rider name uses the `name_mm`/`name_en` fallback chain (mirror `ResultsTable`).
     - Null `team_club` → italic muted `unattached` / `လွတ်လပ်ပြိုင်`.
     - Points bold, right-aligned, tabular-nums.
     - Skip stages whose filtered list is empty.
   - **`TeamStandingTable`**: single table, columns **Rank | Team | Points**. Rank = `position`, Team = `name_en`, Points = `points_or_time_ms`. Apply the imported `PODIUM` tint + medal emoji for positions 1–3.
   - `stageTitle` is currently route-local in `results.tsx`; either pass the pre-resolved title string into `PointsStanding` from the route, or export `stageTitle` for reuse. Prefer passing pre-resolved titles to keep `StandingsTables` route-agnostic.

4. Both tables reuse the wrapper styling from `ResultsTable` (`overflow-x-auto rounded-lg border border-border`, muted thead, `border-t border-border` rows).

## PART B — Move team rosters to Supabase

1. **`src/lib/site-content.functions.ts`** — add:
   ```ts
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
   export const listTeams = createServerFn({ method: "GET" }).handler(async () => { ... });
   ```
   Implementation: parallel `safeSelect("teams", q => q.order("display_order"))` and `safeSelect("team_members", q => q.order("display_order"))` (selecting `team_id` on members). Group members by `team_id`, attach to each team, return `Team[]`. Status coerced to `"confirmed" | "provisional"` (default `"provisional"` on unknown). Missing tables → `[]` via `safeSelect`.

2. **`src/routes/riders.index.tsx`** — refactor:
   - Remove the hardcoded `const TEAMS: Team[]` block (lines ~44–142) and the local `Team`/`TeamStatus` types that overlap with server-fn types. Keep the local `Rider` type for the other tabs. Import `Team as TeamRow, TeamMember` from `site-content.functions`.
   - Add `teamsQO = queryOptions({ queryKey: ["teams"], queryFn: () => listTeams() })`.
   - `loader` calls `ensureQueryData(teamsQO)` alongside `publicRidersQO`.
   - `TeamSection` becomes a `useSuspenseQuery(teamsQO)` consumer; replace `TEAMS.length` with `teams.length`, map over `teams` for `TeamCard`.
   - `TeamCard` accepts `team: TeamRow`; render members in server-provided order. Display name: `mm ? (m.name_mm ?? m.rider_name) : m.rider_name` (Myanmar `name_mm` is all null today — falls back to `rider_name`, expected). Reg shown only when `registration_no` is not null. Slot count = `team.members.length`. Status badge from `team.status`.
   - `StatusBadge` keeps current local typing (`"confirmed" | "provisional"`).
   - All other tabs (Men Elite, Women, Junior, MTB, TBC) untouched.

## Technical notes

- Server fns in `site-content.functions.ts` already use the lazy `extAdmin()` pattern and `safeSelect`; new fn follows the same shape.
- No DB migration needed — tables exist and are populated (9 teams, 32 members; standings Team rows present; points in results).
- No `routeTree.gen.ts` edits.

## Acceptance

- `/results` Points: three per-stage sections (Men Elite, Junior, Women) with scorers.
- `/results` Team: 9-row table, RCC/KNCC/FCC podium tinted with medal emoji.
- `/riders` Team tab visually identical, now DB-driven; editing rows in `public.teams` / `public.team_members` updates the page on reload. No hardcoded TEAMS array remains. No TypeScript errors.
