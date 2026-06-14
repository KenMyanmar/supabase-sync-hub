import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listResults,
  listStandings,
  listStartLists,
  listNotices,
} from "@/lib/site-content.functions";
import { useLang, t } from "@/lib/i18n";
import { RESULTS_TABS, SECTION, EMPTY } from "@/lib/strings";
import { NoResultsYet } from "@/components/NoResultsYet";
import { cn } from "@/lib/utils";

const resultsQO = queryOptions({
  queryKey: ["site", "results"],
  queryFn: () => listResults(),
});
const standingsQO = queryOptions({
  queryKey: ["site", "standings"],
  queryFn: () => listStandings(),
});
const startListsQO = queryOptions({
  queryKey: ["site", "start-lists"],
  queryFn: () => listStartLists(),
});
const noticesQO = queryOptions({
  queryKey: ["site", "notices"],
  queryFn: () => listNotices(),
});

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Results & Standings — MCF National Cycling Event 2026" },
      {
        name: "description",
        content:
          "Start lists, stage results, overall standings, points classification, medal table and official notices for the 2026 MCF National Cycling Event.",
      },
      { property: "og:title", content: "Results — MCF National Cycling Event 2026" },
      {
        property: "og:description",
        content:
          "Live results, standings, points and official communiqués from the 2026 MCF National Cycling Event.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(resultsQO);
    context.queryClient.ensureQueryData(standingsQO);
    context.queryClient.ensureQueryData(startListsQO);
    context.queryClient.ensureQueryData(noticesQO);
  },
  component: ResultsPage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-destructive">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => <NoResultsYet />,
});

function ResultsPage() {
  const { lang } = useLang();
  const [tab, setTab] = useState<(typeof RESULTS_TABS)[number]["id"]>("start-lists");
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">
          {t(SECTION.results, lang)}
        </h1>
      </header>

      <div className="mt-6 flex flex-wrap gap-1 border-b border-border">
        {RESULTS_TABS.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => setTab(r.id)}
            className={cn(
              "rounded-t-md px-3 py-2 text-sm transition-colors",
              tab === r.id
                ? "border-b-2 border-primary font-semibold text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(r, lang)}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <TabContent tab={tab} />
      </div>
    </main>
  );
}

function TabContent({ tab }: { tab: string }) {
  const results = useSuspenseQuery(resultsQO).data;
  const standings = useSuspenseQuery(standingsQO).data;
  const startLists = useSuspenseQuery(startListsQO).data;
  const notices = useSuspenseQuery(noticesQO).data;

  if (tab === "start-lists" && startLists.length === 0) return <NoResultsYet />;
  if (tab === "results" && results.length === 0) return <NoResultsYet />;
  if (tab === "standings" && standings.length === 0) return <NoResultsYet />;
  if (tab === "points") {
    const points = standings.filter((s) => s.classification === "Points");
    if (points.length === 0) return <NoResultsYet />;
  }
  if (tab === "medal") {
    const medals = standings.filter((s) => s.classification === "Medal");
    if (medals.length === 0) return <NoResultsYet />;
  }
  if (tab === "notices" && notices.length === 0)
    return <NoResultsYet message={EMPTY.noNotices} />;

  return (
    <div className="rounded-lg border border-border p-6 text-sm text-muted-foreground">
      Data tables will render here once the table is populated.
    </div>
  );
}
