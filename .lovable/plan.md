Add a "Category TBC" tab to `/riders` for championship-registered riders whose category is not yet classified. Single file edit: `src/routes/riders.index.tsx`.

## Changes (4 edits, exactly as specified)

1. **`derived` useMemo** — after `const mtb = …`, add:
   ```ts
   const tbc = data.filter(
     (r) => r.category === "Uncategorized" && r.in_road && r.in_crit,
   );
   ```
   And add `categoryToConfirm: sortByName(tbc.map((r) => toRider(r, mm)))` to the returned object.

2. **`TabsList`** — between Junior and MTB triggers, insert auto-hiding trigger:
   ```tsx
   {derived.categoryToConfirm.length > 0 ? (
     <TabsTrigger value="tbc">
       {mm ? "အမျိုးအစား အတည်ပြုဆဲ" : "Category TBC"}
     </TabsTrigger>
   ) : null}
   ```

3. **`TabsContent`** — before MTB TabsContent, insert matching content panel rendering `<CategoryToConfirmCard />`.

4. **New `CategoryToConfirmCard` component** — neutral muted styling (not green/amber), uses existing `NeutralBadge`, `RegClarifier`, `RiderList`. Bilingual headline explaining MCF is verifying category.

## Scope guardrails
- Filter stays narrow: `Uncategorized && in_road && in_crit` (≈22 riders), not the wider ~72 uncategorized — MTB-only uncategorized stay inside the open MTB tab.
- Tab auto-hides when count = 0 (disappears as DOB pass classifies riders).
- No changes to other tabs, server function, or DB.
- No new imports needed — all helpers (`NeutralBadge`, `RegClarifier`, `RiderList`, `sortByName`, `toRider`) already exist in the file.
