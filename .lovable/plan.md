## Cleanup pass

1. **`src/routes/programme.tsx`**
   - Remove the `<ScheduleNav />` render call (line ~155).
   - Delete the `function ScheduleNav()` definition (line ~280 to its closing brace).
   - Drop any imports only used by `ScheduleNav` (icons, Link variants) if they become unreferenced.

2. **`src/routes/guide.tsx`**
   - Remove the `<GuideNav />` render call (line ~65).
   - Delete the `function GuideNav()` definition (line ~593 to its closing brace).
   - Drop now-unused imports.

3. **`src/routes/schedule.tsx`** → redirect stub
   ```tsx
   import { createFileRoute, redirect } from "@tanstack/react-router";
   export const Route = createFileRoute("/schedule")({
     beforeLoad: () => { throw redirect({ to: "/programme" }); },
   });
   ```

4. **`src/routes/technical-guide.tsx`** → redirect stub
   ```tsx
   import { createFileRoute, redirect } from "@tanstack/react-router";
   export const Route = createFileRoute("/technical-guide")({
     beforeLoad: () => { throw redirect({ to: "/guide" }); },
   });
   ```

5. **`src/routes/index.tsx`**
   - Remove `Menu` from the `lucide-react` import (line 14 area).
   - Remove `X` from the same import block if it's also unused (legacy mobile-nav icons; the new `MobileNav` component owns these now).
   - Leave any other icon imports still referenced by the homepage intact.

6. **Verification**
   - Let the build run; confirm no TS "declared but never used" errors and no route-tree regen issues.
   - Spot-check `/`, `/programme`, `/guide`, `/schedule` → `/programme`, `/technical-guide` → `/guide` in the preview.

Out of scope: any DB wiring (waiting on your SQL), copy changes, or styling tweaks.
