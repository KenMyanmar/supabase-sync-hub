## Wire `/media/gallery` to the `race-photos` Supabase Storage bucket

### 1. `src/lib/site-content.functions.ts` — append `listGalleryGroups`

Server function that walks the `race-photos` bucket and groups images by top-level folder.

- Load admin inside the handler: `const { extAdmin } = await import("@/integrations/ext-supabase/admin.server")`
- Recursive `walk(prefix)` using `store.list(prefix, { limit: 1000, sortBy: { column: "name", order: "asc" } })`; `entry.id === null` ⇒ folder, recurse
- Root files collapse into `"General"`
- Each image: `url` = plain `getPublicUrl(p)`, `thumbUrl` = `getPublicUrl(p, { transform: { width: 600, height: 600, resize: "cover", quality: 70 } })`
- Sort by `ORDER = ["Opening","Racing","Race","Finisher","Finish","Awards","Archive","General"]`, then alphabetical
- Try/catch ⇒ `[]` on any error so the bilingual empty state still renders

Exports:
```ts
export type GalleryImage = { url: string; thumbUrl: string; name: string };
export type GalleryGroup = { category: string; count: number; images: GalleryImage[] };
export const listGalleryGroups = createServerFn({ method: "GET" }).handler(...)
```

### 2. `src/routes/media.gallery.tsx` — rewrite

- Remove hardcoded `GROUPS` constant
- Add `loader: () => listGalleryGroups()` and `errorComponent`
- In component:
  - `const groups = Route.useLoaderData();`
  - Call hooks first (Rules of Hooks): `const [active, setActive] = useState(groups[0]?.category ?? "");`
  - If `groups.length === 0` → existing bilingual dashed-border `ImageIcon` empty state using `useLang()` + `t()`
  - Else render a tab bar (skip when `groups.length === 1`) showing `Title-Case · count`
  - Resolve `const current = groups.find(g => g.category === active) ?? groups[0];`
  - Render grid `grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4`, each item `<a href={url} target="_blank" rel="noopener noreferrer">` wrapping `<img src={thumbUrl} loading="lazy" className="aspect-square w-full object-cover" />` inside `overflow-hidden rounded-md border border-border`

### Acceptance
- Tabs derived from bucket folders with photo counts
- Thumbnails open full-res in a new tab
- Empty bucket renders the existing bilingual empty state
- No hardcoded image lists in `media.gallery.tsx`
- `admin.server` loaded inside the handler — not in the client bundle
- `useState` runs before any early return
