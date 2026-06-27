import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import {
  listResults,
  listStages,
  listStandings,
  listStartLists,
  listNotices,
  type ResultRow,
  type StageRow,
} from "@/lib/site-content.functions";
import { useLang, t, type Lang } from "@/lib/i18n";
import { RESULTS_TABS, SECTION, EMPTY } from "@/lib/strings";
import { NoResultsYet } from "@/components/NoResultsYet";
import { ResultsTable } from "@/components/ResultsTable";
import { ResultsComments } from "@/components/ResultsComments";
import {
  PointsStanding,
  TeamStandingTable,
  type PointsSection,
} from "@/components/StandingsTables";
import { cn } from "@/lib/utils";

const resultsQO = queryOptions({
  queryKey: ["site", "results"],
  queryFn: () => listResults(),
});
const stagesQO = queryOptions({
  queryKey: ["site", "stages"],
  queryFn: () => listStages(),
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
      {
        property: "og:title",
        content: "Results — MCF National Cycling Event 2026",
      },
      {
        property: "og:description",
        content:
          "Live results, standings, points and official communiqués from the 2026 MCF National Cycling Event.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(resultsQO);
    context.queryClient.ensureQueryData(stagesQO);
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

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "stage"
  );
}

type Group = { stage: StageRow | null; key: string; rows: ResultRow[] };

function groupResultsByStage(
  results: ResultRow[],
  stages: StageRow[],
): Group[] {
  const byId = new Map<string, ResultRow[]>();
  for (const r of results) {
    const k = r.stage_id ?? "__orphan";
    const arr = byId.get(k) ?? [];
    arr.push(r);
    byId.set(k, arr);
  }
  const out: Group[] = [];
  for (const s of stages) {
    const rows = byId.get(s.id);
    if (rows && rows.length) {
      out.push({
        stage: s,
        key: s.slug || slugify(s.name_en ?? s.id),
        rows,
      });
      byId.delete(s.id);
    }
  }
  for (const [k, rows] of byId.entries()) {
    out.push({ stage: null, key: `stage-${k.slice(0, 8)}`, rows });
  }
  return out;
}

function stageTitle(g: Group, lang: Lang): string {
  if (g.stage) {
    return (
      (lang === "mm" ? g.stage.name_mm : g.stage.name_en) ||
      g.stage.name_en ||
      g.stage.name_mm ||
      g.key
    );
  }
  return lang === "mm" ? "ပြိုင်ပွဲ" : "Stage";
}

function ResultsPage() {
  const { lang } = useLang();
  const [tab, setTab] =
    useState<(typeof RESULTS_TABS)[number]["id"]>("results");
  const results = useSuspenseQuery(resultsQO).data;
  const stages = useSuspenseQuery(stagesQO).data;

  const groups = useMemo(
    () => groupResultsByStage(results, stages),
    [results, stages],
  );

  const [activeCategory, setActiveCategory] = useState<string>(
    () => groups[0]?.key ?? "road-race-men-elite",
  );
  const activeKey = groups.some((g) => g.key === activeCategory)
    ? activeCategory
    : (groups[0]?.key ?? "road-race-men-elite");

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
        <TabContent tab={tab} groups={groups} lang={lang} />
      </div>

      <div className="mt-10">
        {groups.length > 1 ? (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              {lang === "mm" ? "ဆွေးနွေးရန် ပြိုင်ပွဲ" : "Discussion thread"}:
            </span>
            <select
              value={activeKey}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            >
              {groups.map((g) => (
                <option key={g.key} value={g.key}>
                  {stageTitle(g, lang)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <ResultsComments category={activeKey} />
      </div>
    </main>
  );
}

function TabContent({
  tab,
  groups,
  lang,
}: {
  tab: string;
  groups: Group[];
  lang: Lang;
}) {
  const standings = useSuspenseQuery(standingsQO).data;
  const startLists = useSuspenseQuery(startListsQO).data;
  const notices = useSuspenseQuery(noticesQO).data;

  if (tab === "results") {
    if (groups.length === 0) return <NoResultsYet />;
    return (
      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.key}>
            <h2 className="mb-3 text-xl font-semibold">{stageTitle(g, lang)}</h2>
            <ResultsTable rows={g.rows} lang={lang} />
          </section>
        ))}
      </div>
    );
  }

  if (tab === "start-lists" && startLists.length === 0) return <NoResultsYet />;
  if (tab === "provisional") return <NoResultsYet />;
  if (tab === "standings" && standings.length === 0) return <NoResultsYet />;
  if (tab === "points") {
    const points = standings.filter((s) => s.classification === "Points");
    if (points.length === 0) return <NoResultsYet />;
  }
  if (tab === "team") {
    const team = standings.filter((s) => s.classification === "Team");
    if (team.length === 0) return <NoResultsYet />;
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
