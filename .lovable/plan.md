
# NC2026 Menu Upgrade + Bilingual Site

Follows `NC2026_Menu_Upgrade_Recommendation.md` verbatim. The doc specifies a flat 8-item top nav (not grouped dropdowns) — overriding the earlier "grouped dropdowns" answer. Media gets a small sub-menu (News, Press Releases, Gallery, Media Contact); Results uses in-page tabs.

## 1. Bilingual infrastructure

- `src/lib/i18n.tsx` — `LangProvider` + `useLang()` hook. Two languages: `"en" | "mm"`. Persisted to `localStorage` under `mcf.lang`. Default `en`. Mounted in `src/routes/__root.tsx` above `<Outlet />`.
- `src/lib/t.ts` — tiny `t({ en, mm }, lang)` helper + `pick(row, field, lang)` for DB rows that have `<field>_en` / `<field>_mm` (auto-fallback to EN when MM empty).
- `src/components/LanguageToggle.tsx` — pill toggle `EN | မြန်မာ`. Header (desktop right of Register) and top of mobile drawer.
- Strings file `src/lib/strings.ts` — central dict for nav labels, CTAs, empty states, the bilingual commissaires notice, etc. Keeps components clean.

## 2. Header / nav rebuild

Edit the existing header in `src/routes/index.tsx` and lift it into `src/components/SiteHeader.tsx` so every route shares it (mounted in `__root.tsx`).

Desktop order (single clean line, English only):
`Overview · Programme · Results · Teams & Riders · Media ▾ · Guide · Partners · [Register]  EN | မြန်မာ`

- Media is the only dropdown (News, Press Releases, Gallery, Media Contact).
- Active link styling driven by `useRouterState` pathname.
- Register stays the red CTA button. Label switches by phase later (Register → Check Status → Rider Info) — for now keep "Register".

Mobile drawer (`src/components/MobileNav.tsx`, `<Sheet>`):
- Register first (red button), then Programme, Results, Teams & Riders, Overview, Media, Guide, Partners.
- Each row shows English label with smaller Myanmar label below.
- Language toggle pinned at drawer top.

## 3. New routes (TanStack file routes)

Create with proper `head()` metadata per route (title, description, og:title, og:description in EN; MM stays in-page).

```
src/routes/
  programme.tsx                       (merges old events + schedule)
  results.tsx                         (tabs: Start Lists, Results, Standings, Points, Medal Table, Notices)
  riders.tsx                          (Teams & Riders — was Status)
  media.tsx                           (media centre landing + <Outlet />)
  media.index.tsx                     (news feed / hub)
  media.press.tsx                     (press releases list)
  media.press.$slug.tsx               (single press release)
  media.gallery.tsx                   (gallery)
  media.contact.tsx                   (media contact)
  guide.tsx                           (was technical-guide; nav label "Guide", page H1 "Technical Guide")
  partners.tsx                        (organisers + sponsors merged)
  status.tsx                          (kept — already exists as part of register flow)
```

File moves / deprecations:
- `src/routes/schedule.tsx` → merge content into `programme.tsx`, then leave a redirect route that `throw redirect({ to: "/programme" })` from `beforeLoad`.
- `src/routes/technical-guide.tsx` → same redirect pattern to `/guide`.
- Old `/events`, `/points`, `/organisers`, `/sponsors`, `/gallery`, `/media` anchor sections on the home page stay as anchors on `index.tsx` for backward compatibility but the nav points to the new top-level routes.

## 4. Data wiring (external Supabase)

All reads through `createServerFn` using `extAdmin()` with explicit safe-column projections — same pattern as `submitRegistration`. New file `src/lib/site-content.functions.ts` exposing:

- `listPressReleases()` → published rows, newest first
- `getPressRelease(slug)` → single row
- `listEvents()` / `getEvent(slug)` / `listStages(eventId)`
- `getStartList(stageId)` / `getResults(stageId)` / `getStandings(eventId, classification)`
- `listNotices()` (Official Communiqués)
- `listConfirmedRiders()` / `listConfirmedTeams()` for `/riders`

Each loader uses the canonical Query pattern: `ensureQueryData(queryOptions)` in loader + `useSuspenseQuery` in component. Every route has `errorComponent` + `notFoundComponent`.

Empty-state component `<NoResultsYet />` renders the bilingual commissaires notice from `strings.ts` when arrays come back empty.

## 5. Schema you create (for reference — I will match exact names you ship)

```
press_releases(id, slug, published_at, cover_url,
               title_en, title_mm, summary_en, summary_mm,
               body_en, body_mm, is_published)
notices(id, ref_no, issued_at, title_en, title_mm,
        body_en, body_mm, attachment_url, is_published)
events(id, slug, name_en, name_mm, date, location_en, location_mm)
stages(id, event_id, slug, name_en, name_mm, date, distance_km, category)
start_lists(id, stage_id, bib, registration_no,
            name_en, name_mm, team_club, category)
results(id, stage_id, position, bib, registration_no,
        name_en, name_mm, team_club, time_ms, gap_ms,
        points, status)
standings(id, event_id, classification, position, bib, registration_no,
          name_en, name_mm, team_club, points_or_time_ms)
  -- classification IN ('GC','Points','KOM','Team','Youth','Medal')
```

RLS: enable on all, add `GRANT SELECT ON ... TO anon` + a `SELECT` policy `USING (is_published = true)` (or always-true for results tables). Service role keeps full access. I read with service role from server fns so RLS isn't strictly required for read paths, but enable it anyway for safety.

Once you've created the tables in your external project, send me the exact table + column names if any differ from above and I'll align.

## 6. Out of scope this turn

- Press release CMS UI (you author directly in Supabase per your earlier answer).
- Phase-based Register button label switching (Register/Check Status/Rider Info). Easy to add once event timing is fixed.
- Translating long-form copy already on the homepage — I'll wire the framework + nav + new pages this turn; sweeping every existing paragraph into MM can be a follow-up.

## 7. Verification

- `bun run` build passes (route tree regenerates clean).
- Browser check at 1920px and 390px: header layout, dropdown, mobile drawer, language toggle persistence after reload, redirects from `/schedule` and `/technical-guide`.
- Each new page renders the bilingual empty state when its table is empty.

After you approve, I'll implement in build mode and report back with the preview URL and a short screenshot tour.
