## Assessment

Yes, this is the right approach — it matches the existing `site-content.functions.ts` + `riders.watch.tsx` pattern exactly (external Supabase via `extAdmin`, `queryOptions` + `ensureQueryData` + `useSuspenseQuery`, fail-soft to `[]`). The view enforces privacy server-side, so the client just renders columns. Keeping `TEAMS` hardcoded is correct since team→rider isn't modeled yet.

Two things worth confirming before I build, because the v7→v10 UI had detail the proposed schema flattens:

1. **MTB subdivisions disappear.** The current MTB tab shows Men Elite 39 · Masters 40+ 16 · Men Junior 18 · Women 1 · Category TBC 38. The proposed derivation (`in_mtb` → Men + Women, no badges) collapses all of that into two groups. If the view doesn't expose Masters / TBC, I'll render it as the spec says (Men / Women, open participation, no provisional badges). OK to lose those subheadings?

2. **Headline counts become live.** Current copy hardcodes "39 confirmed, 15 pending", "112 registered", etc. I'll replace with computed counts from the query (e.g. `${confirmed.length} age-confirmed, ${provisional.length} pending age verification`). The bilingual clarifier line and section labels stay; only the numbers go dynamic.

## Plan

### 1. New file `src/lib/public-riders.functions.ts`
Exactly as specified — `createServerFn` GET, dynamic-imports `extAdmin` inside the handler, selects the 8 columns from `public_riders`, orders by category then name_en, returns `[]` on error. Exports `PublicRider` type.

### 2. Rewrite `src/routes/riders.index.tsx`
- Keep: `head()`/meta, `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`, tab order (Team → Men Elite → Women → Junior → MTB XCO), `StatusBadge`, `NeutralBadge`, `RiderList`, `RegClarifier`, `EliteMenCard`/`MTBCard` shells, `TEAMS` array and Team tab.
- Remove: `MEN_ELITE_CONFIRMED`, `MEN_ELITE_PROVISIONAL`, `JUNIOR_*`, `WOMEN_*`, all `MTB_*` arrays.
- Add: `publicRidersQO = queryOptions({ queryKey: ["public-riders"], queryFn: () => getPublicRiders() })`; loader calls `context.queryClient.ensureQueryData(publicRidersQO)`; component calls `useSuspenseQuery(publicRidersQO)`.
- Derive per tab from `data`:
  - `menElite = filter(category==="Men Elite" && in_road && in_crit)` → split by `status`
  - `junior = filter(category==="Men Junior" && in_road && in_crit)` → split by `status`
  - `women = filter(category==="Women" && in_road && in_crit)` (single list)
  - `mtb = filter(in_mtb)` → split `mtbMen = category!=="Women"`, `mtbWomen = category==="Women"`; no provisional badges
- Name resolution helper: `displayName(r) = mm ? (r.name_my || r.name_en) : (r.name_en || r.name_my)`; adapt `RiderList` row to take `{ name, reg, provisional }` derived from `PublicRider`.
- Headline counts computed from derived arrays (bilingual templates retained).
- `errorComponent` + `notFoundComponent` added (currently only `notFoundComponent` is set).

### Technical notes
- Server fn lives in `src/lib/` (client-safe path), `extAdmin` only imported inside `.handler()` — same as `site-content.functions.ts`, so no client bundle leak.
- No Supabase types regen needed (external project, not Lovable Cloud).
- No schema/migration work; the view is pre-existing.
- Team tab is untouched — `TEAMS`, `TEAM_ROSTERS`, and any team-specific components stay as-is.