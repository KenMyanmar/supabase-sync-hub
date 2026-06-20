import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listNotices } from "@/lib/site-content.functions";
import { useLang, pick } from "@/lib/i18n";
import { CTA } from "@/lib/strings";
import { RichTextContent } from "@/components/RichTextContent";

const noticeQO = (refNo: string) =>
  queryOptions({
    queryKey: ["site", "notice", refNo],
    queryFn: async () => {
      const rows = await listNotices();
      return rows.find((row) => row.ref_no === refNo) ?? null;
    },
  });

export const Route = createFileRoute("/media/notices/$refNo")({
  loader: async ({ context, params }) => {
    const row = await context.queryClient.ensureQueryData(noticeQO(params.refNo));
    if (!row) throw notFound();
  },
  component: NoticeDetail,
  errorComponent: ({ error }) => (
    <p className="text-sm text-destructive">{error.message}</p>
  ),
  notFoundComponent: () => (
    <div className="space-y-3">
      <p className="text-sm">Notice not found.</p>
      <Link to="/media" className="text-sm text-primary underline">
        ← Back to media
      </Link>
    </div>
  ),
});

function NoticeDetail() {
  const { lang } = useLang();
  const { refNo } = Route.useParams();
  const row = useSuspenseQuery(noticeQO(refNo)).data!;
  const title = pick(row, "title", lang) || row.ref_no || "Official notice";
  const body = pick(row, "body", lang);

  return (
    <article className="max-w-3xl space-y-4">
      <Link to="/media" className="text-xs text-primary underline">
        ← {lang === "mm" ? CTA.back.mm : CTA.back.en}
      </Link>
      <p className="text-xs text-muted-foreground">
        {row.issued_at ? new Date(row.issued_at).toLocaleDateString() : ""}
      </p>
      <h1 className="text-2xl font-bold text-primary sm:text-3xl">{title}</h1>
      {row.attachment_url ? (
        <img
          src={row.attachment_url}
          alt={title}
          className="w-full rounded-lg border border-border"
          loading="lazy"
        />
      ) : null}
      <RichTextContent className="space-y-4 text-base text-foreground/90" text={body} />
    </article>
  );
}
