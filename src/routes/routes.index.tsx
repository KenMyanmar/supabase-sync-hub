import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, MapPin } from "lucide-react";
import routeHlegu from "@/assets/mcf-route-hlegu.png.asset.json";
import routeCriterium from "@/assets/mcf-route-criterium.png.asset.json";
import { useLang, t } from "@/lib/i18n";
import { SECTION, ROUTES_CONTENT, CTA, GPX_PENDING } from "@/lib/strings";

const MAP_BY_ASSET: Record<string, string> = {
  "mcf-route-hlegu": routeHlegu.url,
  "mcf-route-criterium": routeCriterium.url,
};

export const Route = createFileRoute("/routes/")({
  head: () => ({
    meta: [
      { title: "Route Details — MCF National Cycling Event 2026" },
      {
        name: "description",
        content:
          "Road Race, MTB XCO and Thuwunna Criterium — distance, elevation, viewing tips and GPX downloads for the 2026 MCF National Cycling Championship.",
      },
      { property: "og:title", content: "Route Details — MCF National Cycling Event 2026" },
      { property: "og:url", content: "https://cyclings.live/routes" },
    ],
    links: [{ rel: "canonical", href: "https://cyclings.live/routes" }],
  }),
  component: RoutesIndex,
});

function RoutesIndex() {
  const { lang } = useLang();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">
          {t(SECTION.routes, lang)}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {lang === "mm"
            ? "လမ်းကြောင်းသုံးခု၏ အသေးစိတ်အချက်အလက်များ — Final Team Version မထွက်မီ မိတ်ဆက်ဗားရှင်း။"
            : "Three race routes — preliminary details ahead of the Final Team Version."}
        </p>
      </header>

      <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {ROUTES_CONTENT.map((r) => {
          const mapUrl = r.mapAsset ? MAP_BY_ASSET[r.mapAsset] : null;
          return (
            <li
              key={r.slug}
              className="overflow-hidden rounded-lg border border-border"
            >
              {mapUrl ? (
                <img
                  src={mapUrl}
                  alt={`${t(r.name, lang)} route map`}
                  className="aspect-[16/10] w-full bg-muted object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex aspect-[16/10] w-full items-center justify-center bg-muted text-muted-foreground">
                  <MapPin className="h-6 w-6" />
                </div>
              )}
              <div className="space-y-3 p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded border border-border px-2 py-0.5">
                    {t(r.type, lang)}
                  </span>
                  <span className="font-mono">{r.date}</span>
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t(r.name, lang)}
                </h2>
                <dl className="grid grid-cols-2 gap-2 text-xs">
                  <dt className="text-muted-foreground">
                    {lang === "mm" ? "အကွာအဝေး" : "Distance"}
                  </dt>
                  <dd className="font-mono">{r.distance}</dd>
                  <dt className="text-muted-foreground">
                    {lang === "mm" ? "မြင့်တက်မှု" : "Elevation"}
                  </dt>
                  <dd className="font-mono">{r.elevation}</dd>
                </dl>
                <p className="line-clamp-3 text-sm text-foreground/90">
                  {t(r.character, lang)}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    to="/routes/$slug"
                    params={{ slug: r.slug }}
                    className="inline-flex items-center rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
                  >
                    {t(CTA.viewRoute, lang)}
                  </Link>
                  <a
                    href={`/routes/${r.slug}.gpx`}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(lang === "mm" ? GPX_PENDING.mm : GPX_PENDING.en);
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted"
                    title={lang === "mm" ? GPX_PENDING.mm : GPX_PENDING.en}
                  >
                    <Download className="h-3.5 w-3.5" />
                    {t(CTA.downloadGpx, lang)}
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
