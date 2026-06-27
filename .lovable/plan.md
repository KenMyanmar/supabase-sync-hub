## Render Medal Table tab on `/results`

### 1. `src/lib/site-content.functions.ts`
Add three nullable integer fields to `StandingRow`:
```ts
gold: number | null;
silver: number | null;
bronze: number | null;
```
No query change — `listStandings` already does `select("*")`.

### 2. `src/components/StandingsTables.tsx` — new `MedalTable`
Props: `{ rows: StandingRow[]; lang: Lang }`.

- Sort by `position` asc.
- Split rows: `ranked` = `position < 99 && name_en !== "Unattached / Independent"`, `unranked` = the rest.
- Columns: **Rank | Team | 🥇 | 🥈 | 🥉 | Total**
  - Total = `points_or_time_ms ?? (gold ?? 0) + (silver ?? 0) + (bronze ?? 0)`
  - Medal columns: `text-center tabular-nums`
  - Total: `font-bold tabular-nums text-right`
- Ranked rows: import & reuse `PODIUM` from `ResultsTable` for tint + medal emoji on rank cell (positions 1–3).
- Unranked row(s): muted text (`text-muted-foreground`), rank cell shows `—`, team name followed by small bilingual label (EN "outside club ranking" / MM "ကလပ်အဆင့်သတ်မှတ်မှု ပြင်ပ"). No podium tint.
- Wrapper: same `overflow-x-auto rounded-lg border border-border` + muted thead + `border-t border-border` rows as siblings.
- Optional bilingual caption above table: EN "Provisional — updated as events finish." / MM "ယာယီ — ပြိုင်ပွဲများပြီးတိုင်း မွမ်းမံပါမည်။" rendered as `text-xs text-muted-foreground mb-2`.

### 3. `src/routes/results.tsx` — wire it up
In `TabContent`, the `tab === "medal"` branch currently filters and only short-circuits on empty. Change it to also render on success:
```ts
if (tab === "medal") {
  const medals = standings.filter((s) => s.classification === "Medal");
  if (medals.length === 0) return <NoResultsYet />;
  return <MedalTable rows={medals} lang={lang} />;
}
```
Import `MedalTable` from `@/components/StandingsTables`.

### Acceptance
- Medal tab shows 6 club rows podium-tinted (KNCC, RCC, Mawlamyine, TYC, FCC, TDC) plus a de-emphasized Unattached row with `—` for rank.
- Reads live from Supabase; no TS errors.
