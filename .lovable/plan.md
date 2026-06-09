# Meet the Organisers Section — Home Page

Add a new bilingual governance section to `src/routes/index.tsx`, placed after Event Details / Points and before Gallery / Sponsors. No backend, registration, or schema changes.

## Scope

- Frontend only, single file edit: `src/routes/index.tsx`
- Pure presentation; no data fetch, no PII, no admin UI
- Uses existing MCF navy/red/gold design tokens from `src/styles.css`

## Section Structure

**Heading (Myanmar-first bilingual):**
- စီစဉ်ကျင်းပရေးအဖွဲ့
- Meet the Organisers

**Intro paragraph:** Myanmar text as supplied verbatim.

**Roles 1–10 (visible cards / desktop table):**
President, Venue Coordination, Ministry Sports Liaison, VP Oversight, VP Event Director, Secretary General, Finance, PCP, Commissaire Panel, Safety Manager — each as Role / Name / Function.

**Roles 11–18 (collapsible block):**
Title: "Operations Support Teams / လုပ်ငန်းဆောင်ရွက်ရေး အထောက်အကူပြုအဖွဲ့များ"
Uses existing shadcn `Collapsible` component. Contains Safety Support, Finish Judge, Timing/Results, Registration/Admin, Marshal/Security, Medical, Logistics, Media/Sponsor.

**Governance note** below the lists — verbatim paragraph supplied by user.

## Layout

```text
Desktop (md+):
  ┌──────────────────────────────────────────────┐
  │  Bilingual heading + intro                    │
  ├──────────────────────────────────────────────┤
  │  Structured table: # | Role | Name | Function│
  │  (roles 1–10, navy header, gold row accents) │
  ├──────────────────────────────────────────────┤
  │  ▸ Operations Support Teams (collapsible)    │
  │      table of roles 11–18                    │
  ├──────────────────────────────────────────────┤
  │  Governance note card (muted bg, gold border)│
  └──────────────────────────────────────────────┘

Mobile:
  Stacked cards per role with Role label (navy),
  Name (bold), Function (muted). Same collapsible.
```

## Wording Rules Enforced

- Ko Naing = PCP / Race Technical Authority
- Ko Linn Linn is Ministry Sports Coordination / Operations Liaison only (NOT PCP)
- TBC kept where supplied; no invented names
- No photos

## Technical Notes

- Define `organisers` array (id, role, nameMm/name, function) and split slice(0,10) / slice(10).
- Use `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` (already in repo).
- Tailwind classes only via semantic tokens (`bg-primary`, `text-primary-foreground`, `border-accent`, etc.). No raw hex.
- Section gets `id="organisers"` for future anchor linking.
- Insert between existing Event Details / Points block and Gallery/Sponsors block — verify exact insertion point by reading `src/routes/index.tsx` first.

## Out of Scope (untouched)

Registration lookup, Supabase client, sync, search, filters, counts, pagination, schema, admin routes, public whitelist, working draft banners.
