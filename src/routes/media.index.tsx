import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listPressReleases, listNotices } from "@/lib/site-content.functions";
import { useLang, pick } from "@/lib/i18n";
import { EMPTY, CTA } from "@/lib/strings";
import { NoResultsYet } from "@/components/NoResultsYet";

type MediaEntry =
  | {
      kind: "press";
      id: string;
      slug: string;
      publishedAt: string | null;
      title: { en: string | null; mm: string | null };
      summary: { en: string | null; mm: string | null };
      imageUrl: string | null;
      tags: string[];
    }
  | {
      kind: "notice";
      id: string;
      refNo: string | null;
      publishedAt: string | null;
      title: { en: string | null; mm: string | null };
      summary: { en: string | null; mm: string | null };
      imageUrl: string | null;
      tags: string[];
    };

const mediaQO = queryOptions({
  queryKey: ["site", "media-feed"],
  queryFn: async (): Promise<MediaEntry[]> => {
    const [press, notices] = await Promise.all([listPressReleases(), listNotices()]);
    const pressEntries: MediaEntry[] = press.map((p) => ({
      kind: "press",
      id: p.id,
      slug: p.slug,
      publishedAt: p.published_at,
      title: { en: p.title_en, mm: p.title_mm },
      summary: { en: p.summary_en, mm: p.summary_mm },
      imageUrl: p.cover_url,
      tags: inferTags(p.title_en, p.title_mm, p.summary_en, p.summary_mm),
    }));
    const noticeEntries: MediaEntry[] = notices.map((n) => ({
      kind: "notice",
      id: n.id,
      refNo: n.ref_no,
      publishedAt: n.issued_at,
      title: { en: n.title_en, mm: n.title_mm },
      summary: {
        en: n.body_en?.split(/\n+/)[0] ?? n.title_en,
        mm: n.body_mm?.split(/\n+/)[0] ?? n.title_mm,
      },
      imageUrl: n.attachment_url,
      tags: ["Announcement", "Event Info", "Media"],
    }));
    return [...pressEntries, ...noticeEntries].sort((a, b) => {
      const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bTime - aTime;
    });
  },
});

function inferTags(...parts: Array<string | null | undefined>) {
  const text = parts.filter(Boolean).join(" ").toLowerCase();
  const tags = new Set<string>(["Media"]);
  if (/register|registration|မှတ်ပုံတင်|စာရင်းပေး/.test(text)) tags.add("Registration");
  if (/women|အမျိုးသမီး/.test(text)) tags.add("Women Cycling");
  if (/sponsor|partner|champion|msp|vittoria/.test(text)) tags.add("Sponsor");
  if (/event|programme|ပြိုင်ပွဲ|လမ်းကြောင်း|အချက်အလက်/.test(text)) tags.add("Event Info");
  if (/announcement|notice|ကြေညာ|အသိပေး/.test(text)) tags.add("Announcement");
  return Array.from(tags);
}

export const Route = createFileRoute("/media/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(mediaQO);
  },
  component: MediaNews,
  errorComponent: ({ error }) => (
    <p className="text-sm text-destructive">{error.message}</p>
  ),
  notFoundComponent: () => <NoResultsYet message={EMPTY.noNews} />,
});

function MediaNews() {
  const { lang } = useLang();
  const items = useSuspenseQuery(mediaQO).data;
  if (items.length === 0) return <NoResultsYet message={EMPTY.noNews} />;
  return (
    <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {items.map((item) => {
        const title = lang === "mm" && item.title.mm ? item.title.mm : item.title.en || item.title.mm || "Media item";
        const summary = lang === "mm" && item.summary.mm ? item.summary.mm : item.summary.en || item.summary.mm || "";
        const to = item.kind === "press" ? "/media/press/$slug" : "/media/notices/$refNo";
        const params = item.kind === "press" ? { slug: item.slug } : { refNo: item.refNo ?? item.id };
        return (
          <li key={`${item.kind}-${item.id}`}>
            <Link
              to={to}
              params={params as never}
              className="block overflow-hidden rounded-lg border border-border transition-colors hover:bg-muted"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={title}
                  className="aspect-[16/9] w-full object-cover"
                  loading="lazy"
                />
              ) : null}
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : ""}</span>
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded border border-border px-2 py-0.5">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="font-semibold text-foreground">{title}</h2>
                <p className="line-clamp-3 text-sm text-muted-foreground">{summary}</p>
                <span className="inline-flex text-sm font-medium text-primary">
                  {lang === "mm" ? CTA.readMore.mm : CTA.readMore.en}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
