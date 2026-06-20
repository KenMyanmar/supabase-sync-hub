import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Radio } from "lucide-react";
import {
  listPressReleases,
  listNotices,
  getLiveUpdates,
  type LiveUpdate,
} from "@/lib/site-content.functions";
import { EMPTY, CTA, formatIsoDate, LIVE_CATEGORY, formatIsoDateTime } from "@/lib/strings";
import { useLang, t } from "@/lib/i18n";
import { NoResultsYet } from "@/components/NoResultsYet";

type MediaEntry =
  | {
      kind: "press";
      id: string;
      slug: string;
      publishedAt: string | null;
      titleMm: string | null;
      titleEn: string | null;
      summaryMm: string | null;
      summaryEn: string | null;
      imageUrl: string | null;
      tags: string[];
    }
  | {
      kind: "notice";
      id: string;
      refNo: string | null;
      publishedAt: string | null;
      titleMm: string | null;
      titleEn: string | null;
      summaryMm: string | null;
      summaryEn: string | null;
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
      titleMm: p.title_mm,
      titleEn: p.title_en,
      summaryMm: p.summary_mm,
      summaryEn: p.summary_en,
      imageUrl: p.cover_url,
      tags: inferTags(p.title_en, p.title_mm, p.summary_en, p.summary_mm),
    }));
    const noticeEntries: MediaEntry[] = notices.map((n) => ({
      kind: "notice",
      id: n.id,
      refNo: n.ref_no,
      publishedAt: n.issued_at,
      titleMm: n.title_mm,
      titleEn: n.title_en,
      summaryMm: n.body_mm?.split(/\n+/)[0] ?? n.title_mm,
      summaryEn: n.body_en?.split(/\n+/)[0] ?? n.title_en,
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
  if (/နောက်ဆုံးနေ့|final day|deadline/.test(text)) tags.add("Archived");
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

function LatestUpdatesStrip() {
  const { lang } = useLang();
  const fn = useServerFn(getLiveUpdates);
  const { data } = useQuery({
    queryKey: ["site", "live-updates", "strip"],
    queryFn: () => fn({ data: { limit: 3 } }),
    refetchInterval: 30_000,
    staleTime: 25_000,
  });
  const items = (data ?? []) as LiveUpdate[];
  if (items.length === 0) return null;
  return (
    <section className="mb-6 rounded-lg border border-accent/40 bg-accent/5 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-accent">
          <Radio className="h-4 w-4" />
          {lang === "mm" ? "နောက်ဆုံးအပ်ဒိတ်များ" : "Latest Updates"}
        </div>
        <Link to="/live" className="text-xs text-primary underline">
          {lang === "mm" ? "အားလုံးကြည့်ရန်" : "View all"} →
        </Link>
      </div>
      <ul className="space-y-2">
        {items.map((u) => {
          const cat = LIVE_CATEGORY[u.category] ?? LIVE_CATEGORY.general;
          const title = lang === "mm" ? u.title_mm || u.title_en : u.title_en || u.title_mm;
          return (
            <li key={u.id} className="flex flex-wrap items-baseline gap-2 text-sm">
              <span className="font-mono text-xs text-muted-foreground">
                {formatIsoDateTime(u.posted_at)}
              </span>
              <span className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                {t(cat, lang)}
              </span>
              <Link to="/live" className="text-foreground/90 hover:text-foreground">
                {title || (lang === "mm" ? "(ခေါင်းစဉ်မရှိ)" : "(no title)")}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function MediaNews() {
  const items = useSuspenseQuery(mediaQO).data;
  return (
    <>
      <LatestUpdatesStrip />
      {items.length === 0 ? (
        <NoResultsYet message={EMPTY.noNews} />
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((item) => (
            <li key={`${item.kind}-${item.id}`}>
              {item.kind === "press" ? (
                <Link
                  to="/media/press/$slug"
                  params={{ slug: item.slug }}
                  className="block overflow-hidden rounded-lg border border-border transition-colors hover:bg-muted"
                >
                  <MediaCardContent item={item} />
                </Link>
              ) : (
                <Link
                  to="/media/notices/$refNo"
                  params={{ refNo: item.refNo ?? item.id }}
                  className="block overflow-hidden rounded-lg border border-border transition-colors hover:bg-muted"
                >
                  <MediaCardContent item={item} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function MediaCardContent({ item }: { item: MediaEntry }) {
  const title = item.titleMm || item.titleEn || "Media item";
  const secondaryTitle = item.titleMm && item.titleEn && item.titleEn !== item.titleMm ? item.titleEn : null;
  const summary = item.summaryMm || item.summaryEn || "";
  const secondarySummary = item.summaryMm && item.summaryEn && item.summaryEn !== item.summaryMm ? item.summaryEn : null;

  return (
    <>
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
          <span>{formatIsoDate(item.publishedAt)}</span>
          {item.tags.map((tag) => (
            <span key={tag} className="rounded border border-border px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
        <div className="space-y-1">
          <h2 lang="my" className="font-semibold text-foreground">{title}</h2>
          {secondaryTitle ? <p className="text-sm text-muted-foreground">{secondaryTitle}</p> : null}
        </div>
        <div className="space-y-1">
          <p lang={item.summaryMm ? "my" : undefined} className="line-clamp-3 text-sm text-muted-foreground">
            {summary}
          </p>
          {secondarySummary ? <p className="line-clamp-2 text-xs text-muted-foreground/90">{secondarySummary}</p> : null}
        </div>
        <span className="inline-flex text-sm font-medium text-primary">{CTA.readMore.mm}</span>
      </div>
    </>
  );
}
