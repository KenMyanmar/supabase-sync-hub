## Goal

Replace the Day 3 (28 June) section on `/programme` with the finalized Criterium + Awards run-of-show, plus add an Award Order list and Spectator Notes. Update the `/fans` Awards block to match (10:00–10:40). Keep current design language.

## Files

**`src/routes/programme.tsx`**
- Add a `notes?: string` field to the `Item` type.
- Replace the 28 June `items` array with the 12-row bilingual run-of-show from the prompt (06:45 sign-on through 10:40 close). Each row's `event` and `category` strings carry the English / Myanmar text inline (matches the existing pattern of mixed-language strings on this page).
- Render a new optional `notes` column in both the mobile cards and the desktop table — when present, shown as small muted text under the row (mobile) and as a 5th column (desktop). The 26 and 27 June rows leave it undefined; columns hide cleanly.
- Below the Day 3 table, add two compact blocks rendered only for the 28 June section:
  - **Award Ceremony Order** — ordered list, 7 items, bilingual (Open Top 10, Junior G/S/B, Women G/S/B, Men Elite G/S/B, Team Top 3, BMX recognition, Fixie recognition).
  - **Spectator Notes** — 4 bullets EN + 4 bullets MM in the existing `border-l-accent` info-block style used by `DraftNotice`.
- Update Day 3 `heading` to read `Thuwunna Criterium + Awards — Final Day Programme`.

**`src/lib/strings.ts`**
- `FANS.awards.time` → `10:00–10:40` (currently already this per code; verify and keep). No structural change to `/fans` beyond ensuring the cross-link copy says "Final-day Criterium + Awards programme" pointing at `/programme#28-June-2026`.

**`src/routes/fans.tsx`**
- In the Awards block, append a small "See full Day 3 run-of-show →" `<Link>` to `/programme` (no hash routing needed; programme is short).

## Out of scope

- No redesign of `/programme`.
- No new route, no DB change.
- The full run-of-show stays on `/programme`, not duplicated on `/fans`.

## Verification

After build, load `/programme` desktop + mobile, confirm Day 3 shows the 12 new rows, Award Order list, and Spectator Notes; `/fans` Awards block links to programme.