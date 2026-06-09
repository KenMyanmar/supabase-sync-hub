## Goal

This project becomes **public-read-only**. A separate MCF admin project (built later) will own data ingestion. We keep the server-side sync plumbing ready but unreachable from the browser, and add the required Myanmar notice to the public page.

## Changes

### 1. Public page `/` (src/routes/index.tsx)
- Keep existing search / event / status filters / pagination / public-safe table (already only renders the whitelisted 7 columns).
- **MTB XCO** already in the event filter — keep.
- Add a prominent notice block above the table (Myanmar):

  > ဤစာရင်းသည် Registration Received List သာ ဖြစ်ပါသည်။ Final Start List မဟုတ်သေးပါ။ Final Start List ကို MCF မှ category, age, event, MCF/UCI ID နှင့် eligibility စိစစ်ပြီးနောက် ထပ်မံကြေညာပေးသွားမည်ဖြစ်ပါသည်။

  Styled as a muted/info card so it reads as official guidance, not an error.

### 2. Remove `/admin` UI
- Delete `src/routes/admin.tsx`. The TanStack Router Vite plugin regenerates `routeTree.gen.ts` automatically and `/admin` returns the root `notFoundComponent`.
- No nav link to `/admin` exists, so nothing else to clean up.

### 3. Server-side helpers (src/lib/registrations.functions.ts)
Keep this file as the single source of registration logic. Reshape it so the public project only **exposes** the read fn; everything write-related is a plain helper unreachable from the browser.

Exports after refactor:
- `lookupRegistration` — `createServerFn` (POST). **Only** server fn exposed to the browser. Unchanged behavior.
- `normalizePhone(raw)` — pure helper (unchanged).
- `normalizeGoogleSheetRows(rows)` — pure helper. Takes parsed Google Form / public CSV rows (header → value records) and returns the normalized DB rows we currently build inline inside the old upload handler: auto-gen `NC26-####`, name/english/team/events/status defaults, `phone_search` via `normalizePhone`, `first_received` from Timestamp, **no `raw_data`**. Reuses the bilingual-header `pick()`.
- `syncFromGoogleSheet({ csvUrl?, csvText? })` — plain async function (not a `createServerFn`, not exported as a route). Fetches the Google Sheet CSV server-side via global `fetch`, parses with the existing delimiter-auto-detect parser, calls `normalizeGoogleSheetRows`, upserts on `registration_no`. Returns `{ inserted, errors, headers, sample }`.

  Critical: **do not import `extAdmin` at module scope** in this file's helper region. Inside `syncFromGoogleSheet()`, load it dynamically:

  ```ts
  const { extAdmin } = await import("@/integrations/ext-supabase/admin.server");
  ```

  This keeps the service-role module out of any client-reachable import chain regardless of how bundlers trace plain exports.

- Drop the old `uploadRegistrationsCsv` server fn entirely.

Add this header comment at the top of the file:

```ts
// Admin sync will be handled by a separate MCF admin project.
// This public project only displays registration status.
//
// Note: because the future admin panel will be a separate Lovable project,
// it cannot directly import this helper. It can copy/reuse the same logic,
// or we can later expose a protected sync endpoint from this project that
// the admin project calls over HTTPS.
```

### 4. Security posture
- `extAdmin()` is imported only inside `.handler()` bodies (for `lookupRegistration`) and inside `syncFromGoogleSheet()` via dynamic `await import(...)`. Never at module scope.
- `phone_search`, `raw_data`, NRC, email, DOB, guardian, emergency contact, UCI ID: never selected by `lookupRegistration`, never typed in `PublicRegistration`.
- `ADMIN_PASSWORD` secret is no longer used by this project. Leaving it in Secrets is harmless; we can delete it later.
- Google Sheet is only fetched server-side inside `syncFromGoogleSheet`, which has no public caller in this project.

### 5. Out of scope (deferred to the MCF admin project)
- Scheduled / triggered sync runs.
- Auth-protected admin endpoint that calls `syncFromGoogleSheet`.
- CSV/TSV manual upload UI.
- Editing `admin_remark` / `status`.

## Technical notes

- Route deletion: removing `src/routes/admin.tsx` is enough; do not hand-edit `src/routeTree.gen.ts` (auto-generated).
- `syncFromGoogleSheet` uses the global `fetch` available in the Worker runtime; no extra deps.
- Sheet CSV URL constant (default arg only): `https://docs.google.com/spreadsheets/d/1i8u0t6P6_45BoLxWINIZBAP-FI8AUUeb01RGKvHtobo/export?format=csv&gid=0`. Not exposed as a `VITE_` env var.
- No DB schema changes.

## Files touched

- `src/routes/index.tsx` — add Myanmar notice block.
- `src/routes/admin.tsx` — **delete**.
- `src/lib/registrations.functions.ts` — add header comment, drop `uploadRegistrationsCsv`, extract `normalizeGoogleSheetRows`, add `syncFromGoogleSheet` with dynamic `extAdmin` import.
