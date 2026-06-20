import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listPressReleases } from "@/lib/site-content.functions";
import { EMPTY, CTA } from "@/lib/strings";
import { NoResultsYet } from "@/components/NoResultsYet";

const pressQO = queryOptions({
  queryKey: ["site", "press-releases"],
  queryFn: () => listPressReleases(),
});

export const Route = createFileRoute("/media/press/")({
  head: () => ({
    meta: [
      { title: "Press Releases — MCF National Cycling Event 2026" },
      {
        name: "description",
        content:
          "Official press releases from the Myanmar Cycling Federation for the 2026 National Cycling Event.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(pressQO);
  },
  component: PressList,
  errorComponent: ({ error }) => (
    <p className="text-sm text-destructive">{error.message}</p>
  ),
  notFoundComponent: () => <NoResultsYet message={EMPTY.noPressReleases} />,
});

function PressList() {
  const press = useSuspenseQuery(pressQO).data;
  if (press.length === 0) {
    return <NoResultsYet message={EMPTY.noPressReleases} />;
  }

  return (
    <ul className="space-y-3">
      {press.map((p) => {
        const title = p.title_mm || p.title_en || p.slug;
        const secondaryTitle =
          p.title_mm && p.title_en && p.title_en !== p.title_mm ? p.title_en : null;
        const summary = p.summary_mm || p.summary_en || "";
        const secondarySummary =
          p.summary_mm && p.summary_en && p.summary_en !== p.summary_mm
            ? p.summary_en
            : null;

        return (
          <li key={p.id}>
            <Link
              to="/media/press/$slug"
              params={{ slug: p.slug }}
              className="block overflow-hidden rounded-lg border border-border hover:bg-muted"
            >
              {p.cover_url ? (
                <img
                  src={p.cover_url}
                  alt={title}
                  className="aspect-[16/9] w-full object-cover"
                  loading="lazy"
                />
              ) : null}
              <div className="space-y-3 p-4">
                <p className="text-xs text-muted-foreground">
                  {p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}
                </p>
                <div className="space-y-1">
                  <h2 lang="my" className="font-semibold text-foreground">
                    {title}
                  </h2>
                  {secondaryTitle ? (
                    <p className="text-sm text-muted-foreground">{secondaryTitle}</p>
                  ) : null}
                </div>
                <div className="space-y-1">
                  <p
                    lang={p.summary_mm ? "my" : undefined}
                    className="text-sm text-muted-foreground"
                  >
                    {summary}
                  </p>
                  {secondarySummary ? (
                    <p className="text-xs text-muted-foreground/90">
                      {secondarySummary}
                    </p>
                  ) : null}
                </div>
                <span className="inline-flex text-sm font-medium text-primary">
                  {CTA.readMore.mm}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
