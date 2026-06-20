import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Radio } from "lucide-react";
import {
  getLiveUpdates,
  type LiveUpdate,
} from "@/lib/site-content.functions";
import { useLang, t } from "@/lib/i18n";
import { SECTION, EMPTY, LIVE_CATEGORY, formatIsoDateTime } from "@/lib/strings";
import { NoResultsYet } from "@/components/NoResultsYet";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Updates — MCF National Cycling Event 2026" },
      {
        name: "description",
        content:
          "Live text updates from the 64th MCF National Cycling Championship 2026 — Road Race, MTB XCO and Thuwunna Criterium.",
      },
      { property: "og:title", content: "Live Updates — MCF National Cycling Event 2026" },
      { property: "og:url", content: "https://cyclings.live/live" },
    ],
    links: [{ rel: "canonical", href: "https://cyclings.live/live" }],
  }),
  component: LivePage,
});

function LivePage() {
  const { lang } = useLang();
  const fn = useServerFn(getLiveUpdates);
  const { data, isLoading } = useQuery({
    queryKey: ["site", "live-updates", "all"],
    queryFn: () => fn({ data: {} }),
    refetchInterval: 30_000,
    staleTime: 25_000,
  });

  const items = (data ?? []) as LiveUpdate[];

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
      <header className="max-w-3xl">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-accent" />
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">
            {t(SECTION.live, lang)}
          </h1>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {lang === "mm"
            ? "၃၀ စက္ကန့်တိုင်း ပြန်လည် update ဖြစ်သည်။ ပြိုင်ပွဲနေ့တွင် တိုက်ရိုက်အပ်ဒိတ်များ စတင်ပါမည်။"
            : "Refreshes every 30 seconds. Updates begin on race day."}
        </p>
      </header>

      <section className="mt-6">
        {isLoading ? (
          <div className="rounded-lg border border-border p-5 text-sm text-muted-foreground">
            {lang === "mm" ? "ဖွင့်နေသည်…" : "Loading…"}
          </div>
        ) : items.length === 0 ? (
          <NoResultsYet message={EMPTY.noLive} />
        ) : (
          <ol className="space-y-3">
            {items.map((u) => {
              const cat = LIVE_CATEGORY[u.category] ?? LIVE_CATEGORY.general;
              const title = lang === "mm" ? u.title_mm || u.title_en : u.title_en || u.title_mm;
              const body = lang === "mm" ? u.body_mm || u.body_en : u.body_en || u.body_mm;
              return (
                <li key={u.id} className="rounded-lg border border-border p-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">{formatIsoDateTime(u.posted_at)}</span>
                    <span className="rounded border border-border bg-muted/40 px-2 py-0.5">
                      {t(cat, lang)}
                    </span>
                  </div>
                  {title ? (
                    <h2 className="mt-2 font-semibold text-foreground">{title}</h2>
                  ) : null}
                  {body ? (
                    <p className="mt-1 whitespace-pre-line text-sm text-foreground/90">
                      {body}
                    </p>
                  ) : null}
                  {u.link_url ? (
                    <a
                      href={u.link_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block text-sm text-primary underline underline-offset-2"
                    >
                      {lang === "mm" ? "ဆက်လက်ဖတ်ရှုရန်" : "Open link"} →
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </main>
  );
}
