## Fixes

**1. Junior 3rd place prize (Road Race & Criterium)** — currently `500,000 / 300,000 / 100,000`, change to `500,000 / 300,000 / 200,000` in `src/routes/technical-guide.tsx` lines 404 and 410.

**2. Add Junior Best Player prizes** — insert two new rows in the prize table:
- `Men Junior — Best Player` → `500,000`
- (Confirm: is there also a Women Junior Best Player? Default = Men Junior only unless you say otherwise.)

**3. Add MSP / CAT as Main Sponsor** — upload the attached MSP|CAT logo via lovable-assets, then update `SponsorsSection` in `src/routes/index.tsx` to show a dedicated "Main Sponsor" block above the sponsor-slot grid with the MSP|CAT logo prominently displayed (full-width card, MCF navy frame). Keep the 8 placeholder slots below as "Partner Sponsors".

## Out of scope
No changes to registration, Supabase, schema, admin routes, or PII handling.

## Question before I build
- Should I add **Women Junior — Best Player (500,000)** too, or Men Junior only?
- The "Main Sponsor" label — do you want it bilingual (e.g. `အဓိက ပံ့ပိုးသူ / Main Sponsor`)? Default = yes.
