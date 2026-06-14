import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listPressReleases } from "@/lib/site-content.functions";
import { useLang, pick } from "@/lib/i18n";
import { EMPTY } from "@/lib/strings";
import { NoResultsYet } from "@/components/NoResultsYet";

const pressQO = queryOptions({
  queryKey: ["site", "press-releases"],
  queryFn: () => listPressReleases(),
});

export const Route = createFileRoute("/media/press")({
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
  const { lang } = useLang();
  const press = useSuspenseQuery(pressQO).data;
  if (press.length === 0)
    return <NoResultsYet message={EMPTY.noPressReleases} />;
  return (
    <ul className="space-y-3">
      {press.map((p) => (
        <li key={p.id}>
          <Link
            to="/media/press/$slug"
            params={{ slug: p.slug }}
            className="block rounded-lg border border-border p-4 hover:bg-muted"
          >
            <p className="text-xs text-muted-foreground">
              {p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}
            </p>
            <h3 className="mt-1 font-semibold text-foreground">
              {pick(p, "title", lang) || p.slug}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {pick(p, "summary", lang)}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
