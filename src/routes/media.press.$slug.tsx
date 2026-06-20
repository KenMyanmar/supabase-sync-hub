import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getPressRelease } from "@/lib/site-content.functions";
import { useLang, pick, t } from "@/lib/i18n";
import { CTA } from "@/lib/strings";
import { RichTextContent } from "@/components/RichTextContent";

const pressQO = (slug: string) =>
  queryOptions({
    queryKey: ["site", "press", slug],
    queryFn: () => getPressRelease({ data: { slug } }),
  });

export const Route = createFileRoute("/media/press/$slug")({
  loader: async ({ context, params }) => {
    const row = await context.queryClient.ensureQueryData(pressQO(params.slug));
    if (!row) throw notFound();
  },
  component: PressDetail,
  errorComponent: ({ error }) => (
    <p className="text-sm text-destructive">{error.message}</p>
  ),
  notFoundComponent: () => (
    <div className="space-y-3">
      <p className="text-sm">Press release not found.</p>
      <Link to="/media/press" className="text-sm text-primary underline">
        ← Back to all press releases
      </Link>
    </div>
  ),
});

function PressDetail() {
  const { lang } = useLang();
  const { slug } = Route.useParams();
  const row = useSuspenseQuery(pressQO(slug)).data!;
  const title = pick(row, "title", lang);
  const summary = pick(row, "summary", lang);
  const body = pick(row, "body", lang);
  return (
    <article className="max-w-3xl space-y-4">
      <Link to="/media/press" className="text-xs text-primary underline">
        ← {t(CTA.back, lang)}
      </Link>
      <p className="text-xs text-muted-foreground">
        {row.published_at ? new Date(row.published_at).toLocaleDateString() : ""}
      </p>
      <h1 className="text-2xl font-bold text-primary sm:text-3xl">{title}</h1>
      {row.cover_url ? (
        <img
          src={row.cover_url}
          alt={title}
          className="w-full rounded-lg border border-border"
          loading="lazy"
        />
      ) : null}
      {summary ? <p className="text-base text-foreground/90">{summary}</p> : null}
      <RichTextContent className="space-y-4 text-base text-foreground/90" text={body} />
    </article>
  );
}
