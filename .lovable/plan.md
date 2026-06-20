## Scope

Move cyclings.live from a registration portal to a fan-facing event site. Ship the 4 new pages and polish 4 existing ones. Preserve current design, bilingual EN/MM, no admin UI this pass.

## Assumptions

- `live_updates` and `riders_to_watch` are added to the external Supabase project via the user's `NC2026_fan_event_upgrade_migration.sql` (run outside Lovable). Lovable code does not create the tables; queries degrade to empty arrays via existing `safeSelect` if missing.
- Reuse `src/integrations/ext-supabase/admin.server.ts` and `safeSelect` in `src/lib/site-content.functions.ts`.
- GPX files dropped into `public/routes/<slug>.gpx` later. Until present, detail pages show "GPX pending in Final Team Version".
- Award ceremony time = "After Criterium races" (no fixed time exists in codebase).

## Data layer (`src/lib/site-content.functions.ts`)

Add types + server fns:

- `getLiveUpdates({ limit = 50 })` — `is_published=true`, order `posted_at desc`.
- `getRecentLiveUpdates()` — `is_published=true`, `posted_at >= now()-6h`, limit 3.
- `getRidersToWatch()` — `is_published=true`, order by `category, display_order, name_en`.

All return `[]` on missing-table / permission errors.

## New strings (`src/lib/strings.ts`)

Bilingual blocks for `fansPage`, `routeDetails` (3 routes), `sponsorEventVillage`, `liveCategoryLabels`, `liveEmpty`, `ridersWatchEmpty`, `gpxPending`.

## New routes

### `/fans` (`src/routes/fans.tsx`)
Static bilingual page with sections: Hero, Race Day Guide (3 days), Best Places to Watch, Thuwunna Criterium Viewing Guide, Arrival & Parking, Race-Day Safety, Award Ceremony, CTA row → /programme, /routes, /media.

### `/live` (`src/routes/live.tsx`)
Reverse-chronological feed via `useQuery({ refetchInterval: 30_000 })`. Card: timestamp + category badge + bilingual title/body + optional link. Empty state bilingual.

### `/routes` (`src/routes/routes.index.tsx`) + layout (`src/routes/routes.tsx`)
Index lists three route cards: Road Race, MTB XCO, Criterium — date, distance, elevation, type, race character, GPX button (or pending), link to detail.

### `/routes/$slug` (`src/routes/routes.$slug.tsx`)
Three slugs: `road-race-hlegu-11-hills`, `mtb-xco-mirror-mountains`, `thuwunna-criterium`. Content authored in strings using known values:
- Road Race: 100.98 km, 806 m gain, ~11 climbs, M Elite/Junior 100, W Elite/Open 60.
- Criterium: 1.3 km/lap, M Junior 15, W 16, M Elite 20, Special Open 15.
- MTB XCO: distance/elevation marked pending.

404 via `notFound()` for unknown slug.

### `/riders/watch` (`src/routes/riders.watch.tsx`)
Reads `getRidersToWatch`, groups by category in fixed order (Men Elite, Women, Junior, Past Champions, SEA Games). Card: photo or initials, bilingual name, team/club, category badge, short bio, palmarès bullets. Click → dialog (existing `ui/dialog`) with full bio + palmarès. Empty state bilingual.

`/riders` stays a layout-able parent: convert `riders.tsx` into a layout with `<Outlet />`, move existing body into `riders.index.tsx`. New leaf is `riders.watch.tsx`.

## Header LIVE pill

New `src/lib/useLivePill.ts` hook using `getRecentLiveUpdates`, `refetchInterval: 30_000`. Renders a compact red pill linking to `/live` in `SiteHeader.tsx` and `MobileNav.tsx` when ≥1 recent row. Hidden on error/empty. Reserve space so layout doesn't jump.

## Existing-page upgrades

### `/media` (`media.index.tsx`)
Add a top "Latest Updates" strip pulling 3 newest `live_updates`. Each links to `/live`. Hide strip when none. Keep existing posts feed untouched.

### `/media/gallery`
Replace placeholder with grouped sections: 26 June Road Race, 27 June MTB XCO, 28 June Criterium + Awards, Archive. Each empty group shows clean coming-soon tile. Images sourced from existing `src/assets/*` plus future uploads (placeholder map for now).

### `/results`
Add missing tabs to `RESULTS_TABS`: Start Lists, Provisional Results, Official Results, Points Standing, Team Standing, Medal Table, Official Notices. Build `RidersResultsTable` reusable component:
- Props: rows, columns config, search keys, sortable columns, category + team filters.
- Search across name, name_mm, bib, registration_no.
- Used by Start Lists, Results, Standings tabs.
Keep official-confirmation empty state when no rows.

### `/partners`
Restructure into sections: Main Sponsor (MSP/CAT), Partner Sponsors (existing assets), Champion Bonus Award (3 lines crediting Sport Gear Trading), Event Village / Booth Info (28 June Thuwunna), Become a Partner CTA — `mailto:pyiwatun@gmail.com` (already in project as media contact) labelled "Partnership enquiries: MCF Media".

## Navigation

Extend `NAV` and `MOBILE_NAV` in `strings.ts`:
Overview, Programme, Results, Riders, **Fans**, **Live**, **Routes**, Media, Guide, Partners.

If desktop overflow occurs at common widths, condense via dropdowns:
- Race: Programme, Routes, Guide, Results
- Community: Fans, Riders (Confirmed + Riders to Watch), Media
- Partners (top-level)

Mobile nav lists all pages flat.

## SEO

Per-route `head()` for all new routes with bilingual-aware title + description + `og:title` + `og:url` + leaf `canonical`. `/routes/$slug` derives title from loader data.

## Quiet fix

Hydration mismatch on `/media` from `toLocaleDateString()` server vs client: switch press/notice cards to a stable `formatISODateUTC` helper (YYYY-MM-DD or fixed `en-US` with `timeZone: "UTC"`). Apply to `MediaCardContent` and any other date renders on the feed.

## Out of scope

- GPS live tracking, fantasy games, video production.
- Admin UI for posting live updates / managing riders (you post via SQL).
- Schema changes beyond the supplied migration.
- Editing or rewriting the existing Technical Guide body — only add links from its route cards to the new `/routes/$slug` pages.

## Verification

- Build + route-tree generation succeed.
- Visit: `/fans`, `/live`, `/routes`, all three `/routes/$slug`, `/riders/watch`, `/media`, `/media/gallery`, `/results`, `/partners`, plus desktop header and mobile nav.
- LIVE pill appears only when a published `live_updates` row exists within last 6h (seed a test row via SQL to confirm, then unpublish).
- With both new tables missing/empty: every page renders empty states; no crash.
- GPX buttons show pending state until files dropped under `public/routes/`.
- `/media` hydration warning is gone after the date-format fix.

## Build order

1. Add types + 3 server fns in `site-content.functions.ts`.
2. Add bilingual strings.
3. New routes: `/fans`, `/live`, `/routes`, `/routes/$slug`, `/riders/watch` (convert `/riders` to layout).
4. `useLivePill` hook + header/mobile integration.
5. Media `Latest Updates` strip + Gallery grouping.
6. Results tabs + reusable searchable/sortable table.
7. Partners restructure.
8. Nav extension (+ optional dropdown collapse).
9. Date hydration fix on media feed.
10. SEO `head()` per new route.

## What I need from you to fill content later (non-blocking)

- GPX files per route (drop into `public/routes/`).
- Initial `riders_to_watch` rows (you'll insert via SQL).
- Gallery images per race day (upload when available).
- Confirmation of MTB XCO distance/elevation when finalized.
