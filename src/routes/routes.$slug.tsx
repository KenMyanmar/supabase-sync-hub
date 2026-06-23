import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Download, ChevronLeft } from "lucide-react";
import routeHlegu from "@/assets/mcf-route-hlegu.png.asset.json";
import routeCriterium from "@/assets/mcf-route-criterium.png.asset.json";
import routeMtb from "@/assets/mcf-route-mtb-strava.png.asset.json";
import { useLang, t } from "@/lib/i18n";
import { ROUTES_CONTENT, CTA, GPX_PENDING } from "@/lib/strings";
import { NoResultsYet } from "@/components/NoResultsYet";
import { ElevationProfile } from "@/components/ElevationProfile";

const MAP_BY_ASSET: Record<string, string> = {
  "mcf-route-hlegu": routeHlegu.url,
  "mcf-route-criterium": routeCriterium.url,
  "mcf-route-mtb-mirror-mountains": routeMtb.url,
};


export const Route = createFileRoute("/routes/$slug")({
  loader: ({ params }) => {
    const route = ROUTES_CONTENT.find((r) => r.slug === params.slug);
    if (!route) throw notFound();
    return route;
  },
  head: ({ params, loaderData }) => {
    const name = loaderData?.name.en ?? "Route";
    const type = loaderData?.type.en ?? "Route";
    return {
      meta: [
        { title: `${name} — ${type} · MCF National Cycling Event 2026` },
        {
          name: "description",
          content: loaderData?.character.en ?? "Route details for the 2026 MCF National Cycling Event.",
        },
        { property: "og:title", content: `${name} — MCF National Cycling Event 2026` },
        { property: "og:url", content: `https://cyclings.live/routes/${params.slug}` },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `https://cyclings.live/routes/${params.slug}` }],
    };
  },
  component: RouteDetail,
  notFoundComponent: () => <NoResultsYet />,
  errorComponent: ({ error }) => (
    <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-destructive">{error.message}</p>
  ),
});

function RouteDetail() {
  const { lang } = useLang();
  const r = Route.useLoaderData();
  const mapUrl = r.mapAsset ? MAP_BY_ASSET[r.mapAsset] : null;
  const profile = "profile" in r ? (r as { profile?: readonly { d: number; e: number }[] }).profile : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
      <Link
        to="/routes"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        {t(CTA.back, lang)}
      </Link>

      <header className="mt-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded border border-border px-2 py-0.5">
            {t(r.type, lang)}
          </span>
          <span className="font-mono">{r.date}</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold text-primary sm:text-4xl">
          {t(r.name, lang)}
        </h1>
        <p className="mt-3 text-sm text-foreground/90 sm:text-base">
          {t(r.character, lang)}
        </p>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="space-y-4">
          {mapUrl ? (
            <img
              src={mapUrl}
              alt={`${t(r.name, lang)} route map`}
              className="aspect-[16/10] w-full rounded-lg border border-border object-cover"
            />
          ) : !profile ? (
            <div className="flex aspect-[16/10] w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
              {lang === "mm" ? "မြေပုံကို Final Team Version တွင် ထုတ်ပြန်ပါမည်" : "Map pending in Final Team Version"}
            </div>
          ) : null}
          {profile && profile.length >= 2 ? <ElevationProfile points={profile} /> : null}
        </div>


        <section className="rounded-lg border border-border p-5">
          <h2 className="mb-3 font-semibold text-foreground">
            {lang === "mm" ? "အကျဉ်းချုပ်" : "Overview"}
          </h2>
          <dl className="grid grid-cols-3 gap-y-2 text-sm">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {lang === "mm" ? "အကွာအဝေး" : "Distance"}
            </dt>
            <dd className="col-span-2 font-mono">{r.distance}</dd>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {lang === "mm" ? "မြင့်တက်မှု" : "Elevation"}
            </dt>
            <dd className="col-span-2 font-mono">{r.elevation}</dd>
            {r.sections.map((s: { label: { en: string; mm: string }; value: { en: string; mm: string } }) => (
              <div key={s.label.en} className="contents">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {t(s.label, lang)}
                </dt>
                <dd className="col-span-2">{t(s.value, lang)}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <section className="mt-5 rounded-lg border border-border p-5">
        <h2 className="mb-2 font-semibold text-foreground">
          {lang === "mm" ? "ပရိသတ်များအတွက် ကြည့်ရှုနည်း" : "Viewing tips"}
        </h2>
        <p className="text-sm text-foreground/90">{t(r.viewingTips, lang)}</p>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <a
          href={`/routes/${r.slug}.gpx`}
          onClick={(e) => {
            e.preventDefault();
            alert(lang === "mm" ? GPX_PENDING.mm : GPX_PENDING.en);
          }}
          className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          <Download className="h-3.5 w-3.5" />
          {t(CTA.downloadGpx, lang)}
        </a>
        <Link
          to="/fans"
          className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          {lang === "mm" ? "ပရိသတ်လမ်းညွှန်" : "Fan guide"}
        </Link>
        <Link
          to="/programme"
          className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
        >
          {lang === "mm" ? "ပြိုင်ပွဲအစီအစဉ်" : "Programme"}
        </Link>
      </div>
    </main>
  );
}
