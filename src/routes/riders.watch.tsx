import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import {
  getRidersToWatch,
  type RiderToWatch,
} from "@/lib/site-content.functions";
import { useLang, t } from "@/lib/i18n";
import { SECTION, EMPTY, RIDER_CATEGORY } from "@/lib/strings";
import { NoResultsYet } from "@/components/NoResultsYet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ridersWatchQO = queryOptions({
  queryKey: ["site", "riders-to-watch"],
  queryFn: () => getRidersToWatch(),
});

export const Route = createFileRoute("/riders/watch")({
  head: () => ({
    meta: [
      { title: "Riders to Watch — MCF National Cycling Event 2026" },
      {
        name: "description",
        content:
          "Profiles of contenders to watch at the 64th MCF National Cycling Championship 2026 — Men Elite, Women, Junior, past champions and SEA Games hopefuls.",
      },
      { property: "og:title", content: "Riders to Watch — MCF National Cycling Event 2026" },
      { property: "og:url", content: "https://cyclings.live/riders/watch" },
    ],
    links: [{ rel: "canonical", href: "https://cyclings.live/riders/watch" }],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(ridersWatchQO);
  },
  component: RidersWatchPage,
  errorComponent: ({ error }) => (
    <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-destructive">{error.message}</p>
  ),
  notFoundComponent: () => <NoResultsYet message={EMPTY.noRidersToWatch} />,
});

const CATEGORY_ORDER: RiderToWatch["category"][] = [
  "men_elite",
  "women",
  "junior",
  "past_champion",
  "sea_games",
];

function initials(r: RiderToWatch) {
  const src = (r.name_en || r.name_mm || "").trim();
  const parts = src.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "·";
}

function RidersWatchPage() {
  const { lang } = useLang();
  const data = useSuspenseQuery(ridersWatchQO).data as RiderToWatch[];
  const [open, setOpen] = useState<RiderToWatch | null>(null);

  if (data.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            {t(SECTION.ridersWatch, lang)}
          </h1>
        </header>
        <div className="mt-6">
          <NoResultsYet message={EMPTY.noRidersToWatch} />
        </div>
      </main>
    );
  }

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    rows: data.filter((r) => r.category === cat),
  })).filter((g) => g.rows.length > 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">
          {t(SECTION.ridersWatch, lang)}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {lang === "mm"
            ? "ပြိုင်ပွဲတွင် စောင့်ကြည့်ထိုက်သော ပြိုင်ပွဲဝင်များ။"
            : "Contenders to watch across each category."}
        </p>
      </header>

      <div className="mt-8 space-y-10">
        {grouped.map(({ cat, rows }) => (
          <section key={cat}>
            <h2 className="mb-3 text-lg font-semibold text-foreground">
              {t(RIDER_CATEGORY[cat], lang)}
            </h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => setOpen(r)}
                    className="flex w-full gap-3 rounded-lg border border-border p-3 text-left transition-colors hover:bg-muted"
                  >
                    {r.photo_url ? (
                      <img
                        src={r.photo_url}
                        alt={r.name_en ?? r.name_mm ?? "Rider"}
                        className="h-16 w-16 shrink-0 rounded-md object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md bg-muted font-mono text-sm text-muted-foreground">
                        {initials(r)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-foreground">
                        {lang === "mm" ? r.name_mm || r.name_en : r.name_en || r.name_mm}
                      </div>
                      {(lang === "mm" ? r.name_en : r.name_mm) ? (
                        <div
                          lang={lang === "mm" ? "en" : "my"}
                          className="truncate text-xs text-muted-foreground"
                        >
                          {lang === "mm" ? r.name_en : r.name_mm}
                        </div>
                      ) : null}
                      <div className="mt-1 text-xs text-muted-foreground">
                        {r.team_club ?? "—"}
                      </div>
                      <div className="mt-1 inline-block rounded border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t(RIDER_CATEGORY[r.category], lang)}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-w-lg">
          {open ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {lang === "mm" ? open.name_mm || open.name_en : open.name_en || open.name_mm}
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  {t(RIDER_CATEGORY[open.category], lang)}
                  {open.team_club ? ` · ${open.team_club}` : ""}
                </p>
              </DialogHeader>
              <div className="space-y-3">
                {open.photo_url ? (
                  <img
                    src={open.photo_url}
                    alt={open.name_en ?? open.name_mm ?? "Rider"}
                    className="aspect-[4/3] w-full rounded-md object-cover"
                  />
                ) : null}
                {(lang === "mm" ? open.bio_mm || open.bio_en : open.bio_en || open.bio_mm) ? (
                  <p className="whitespace-pre-line text-sm text-foreground/90">
                    {lang === "mm" ? open.bio_mm || open.bio_en : open.bio_en || open.bio_mm}
                  </p>
                ) : null}
                {(() => {
                  const list = lang === "mm" ? open.palmares_mm : open.palmares_en;
                  if (!list || list.length === 0) return null;
                  return (
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {list.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  );
                })()}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </main>
  );
}
