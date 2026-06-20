import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Eye, Car, ShieldAlert, Trophy, MapPin } from "lucide-react";
import { useLang, t } from "@/lib/i18n";
import { FANS, CTA } from "@/lib/strings";

export const Route = createFileRoute("/fans")({
  head: () => ({
    meta: [
      { title: "For Fans — MCF National Cycling Event 2026" },
      {
        name: "description",
        content:
          "Spectator guide for the 64th MCF National Cycling Championship 2026: where to watch, parking, safety, and the award ceremony.",
      },
      { property: "og:title", content: "For Fans — MCF National Cycling Event 2026" },
      {
        property: "og:description",
        content:
          "Race-day viewing guide, Thuwunna Criterium spectator tips, parking and safety information.",
      },
      { property: "og:url", content: "https://cyclings.live/fans" },
    ],
    links: [{ rel: "canonical", href: "https://cyclings.live/fans" }],
  }),
  component: FansPage,
});

function Block({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: { en: string; mm: string };
  children: React.ReactNode;
}) {
  const { lang } = useLang();
  return (
    <section className="rounded-lg border border-border p-5">
      <div className="mb-3 flex items-center gap-2 text-foreground">
        <span className="text-primary">{icon}</span>
        <h2 className="font-semibold">{t(title, lang)}</h2>
      </div>
      {children}
    </section>
  );
}

function BiList({ items }: { items: ReadonlyArray<{ en: string; mm: string }> }) {
  const { lang } = useLang();
  return (
    <ul className="space-y-2 text-sm">
      {items.map((it) => (
        <li key={it.en} className="border-l-2 border-l-accent/60 pl-3">
          <span className="block text-foreground/90">{lang === "mm" ? it.mm : it.en}</span>
          <span
            lang={lang === "mm" ? "en" : "my"}
            className="block text-xs text-muted-foreground"
          >
            {lang === "mm" ? it.en : it.mm}
          </span>
        </li>
      ))}
    </ul>
  );
}

function FansPage() {
  const { lang } = useLang();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">
          {t(FANS.heroTitle, lang)}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          {t(FANS.heroLead, lang)}
        </p>
      </header>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Block icon={<CalendarDays className="h-4 w-4" />} title={FANS.raceDays.title}>
          <ul className="space-y-2 text-sm">
            {FANS.raceDays.items.map((d) => (
              <li key={d.date} className="rounded-md bg-muted/40 px-3 py-2">
                <div className="font-mono text-xs text-muted-foreground">{d.date}</div>
                <div className="text-foreground/90">{lang === "mm" ? d.mm : d.en}</div>
                <div
                  lang={lang === "mm" ? "en" : "my"}
                  className="text-xs text-muted-foreground"
                >
                  {lang === "mm" ? d.en : d.mm}
                </div>
              </li>
            ))}
          </ul>
        </Block>

        <Block icon={<Eye className="h-4 w-4" />} title={FANS.bestPlaces.title}>
          <BiList items={FANS.bestPlaces.items} />
        </Block>

        <Block icon={<MapPin className="h-4 w-4" />} title={FANS.criteriumGuide.title}>
          <BiList items={FANS.criteriumGuide.items} />
        </Block>

        <Block icon={<Car className="h-4 w-4" />} title={FANS.arrival.title}>
          <BiList items={FANS.arrival.items} />
        </Block>

        <Block icon={<ShieldAlert className="h-4 w-4" />} title={FANS.safety.title}>
          <BiList items={FANS.safety.items} />
        </Block>

        <Block icon={<Trophy className="h-4 w-4" />} title={FANS.awards.title}>
          <dl className="grid grid-cols-3 gap-2 text-sm">
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {lang === "mm" ? "ရက်စွဲ" : "Date"}
            </dt>
            <dd className="col-span-2">{t(FANS.awards.date, lang)}</dd>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {lang === "mm" ? "နေရာ" : "Location"}
            </dt>
            <dd className="col-span-2">{t(FANS.awards.location, lang)}</dd>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {lang === "mm" ? "အချိန်" : "Time"}
            </dt>
            <dd className="col-span-2">{t(FANS.awards.time, lang)}</dd>
          </dl>
          <Link
            to="/programme"
            className="mt-3 inline-block text-sm text-primary underline underline-offset-2"
          >
            {lang === "mm"
              ? "Day 3 အစီအစဉ်အပြည့်အစုံ ကြည့်ရှုရန် →"
              : "See full Day 3 run-of-show →"}
          </Link>
        </Block>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          to="/programme"
          className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted"
        >
          {lang === "mm" ? "ပြိုင်ပွဲအစီအစဉ်" : "Programme"}
        </Link>
        <Link
          to="/routes"
          className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted"
        >
          {lang === "mm" ? "လမ်းကြောင်းအသေးစိတ်" : "Routes"}
        </Link>
        <Link
          to="/media"
          className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted"
        >
          {lang === "mm" ? "သတင်းနှင့်မီဒီယာ" : "Media"}
        </Link>
        <Link
          to="/live"
          className="inline-flex items-center rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
        >
          {t(CTA.viewResults, lang).replace(/Results|ရလဒ်များ/, lang === "mm" ? "တိုက်ရိုက်အပ်ဒိတ်" : "Live Updates")}
        </Link>
      </div>
    </main>
  );
}
