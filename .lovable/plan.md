# NC2026: Registration Closed Gate (driven by `site_settings`)

Make the public Register page and Register CTAs respect a remote on/off switch in the external Supabase `site_settings` table. Fail closed.

## Assumptions

- `site_settings` lives on the **external** Supabase project (same one as `press_releases`, `registrations`, etc.), since that is also where registration data is written. The MCF team will create/seed the row there.
- Schema per prompt: `id boolean primary key (=true)`, `registration_open boolean`, `registration_closed_message_en text`, `registration_closed_message_mm text`.
- Public read access is/will be granted on `site_settings` (RLS + `GRANT SELECT TO anon`). If not, the gate degrades to **closed** (fail-closed), matching the spec.
- I will NOT create or alter the table from Lovable — the user's separate Supabase workflow owns SQL.

## Data layer

Add a new server function `getSiteSettings` in `src/lib/site-content.functions.ts` (reuses `extAdmin` like the other site-content reads, swallows missing-table/permission errors and returns `{ registration_open: false, ... }` so we fail closed):

```ts
export type SiteSettings = {
  registration_open: boolean;
  registration_closed_message_en: string;
  registration_closed_message_mm: string;
};

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async (): Promise<SiteSettings> => { /* read row id=true; on any error → closed */ },
);
```

## Hook

New `src/lib/useRegistrationOpen.ts`:

```ts
export function useRegistrationOpen() {
  const fn = useServerFn(getSiteSettings);
  const { data, isLoading } = useQuery({
    queryKey: ["site_settings"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
  return {
    loading: isLoading,
    open: data?.registration_open === true,           // fail-closed default
    messageMm: data?.registration_closed_message_mm || FALLBACK_MM,
    messageEn: data?.registration_closed_message_en || FALLBACK_EN,
  };
}
```

Fallback constants live in the same file (exact strings from the prompt).

## Register page guard — `src/routes/register.tsx`

At the top of `RegisterPage()`, before any form state is rendered:

```tsx
const { loading, open, messageMm, messageEn } = useRegistrationOpen();
if (loading) return null;
if (!open) return <RegistrationClosed mm={messageMm} en={messageEn} />;
```

`RegistrationClosed` = the exact bilingual block from the prompt (heading + Myanmar primary + English secondary, centered card).

The existing multi-step form stays untouched below the guard.

## CTA hiding

Use the same hook to hide/disable Register entry points when `!open` (and render nothing while `loading` to avoid flicker of the wrong state):

1. **`src/components/SiteHeader.tsx`** — desktop header Register button (line ~104). Hide when closed.
2. **`src/components/MobileNav.tsx`** — mobile sheet Register link (line ~46). Hide when closed.
3. **`src/routes/index.tsx`**:
   - Hero "Register Now" link (~line 200) → hide when closed.
   - Footer "Open Registration Form" link (~line 1285) → replace with a small bilingual "Registration closed" note when closed.

The hook is cheap (single cached query, `staleTime: 60s`), so calling it in 3–4 components is fine. No prop drilling.

## Out of scope

- SQL / table creation / RLS for `site_settings` (user owns that).
- Admin UI to toggle the flag.
- Changes to the registration form itself, submit flow, or any other public content page.

## Verification

1. With `registration_open = true` (or row reachable & true): form renders, all CTAs visible — unchanged behavior.
2. With `registration_open = false`: `/register` shows the bilingual closed card, form not in DOM, header/mobile/hero CTAs hidden, footer shows closed note.
3. With table missing or permission denied: same as (2) — fail closed.
4. Build + route-tree generation succeed (no new routes, only new lib files + edits to existing routes/components).
