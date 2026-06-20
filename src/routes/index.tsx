import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  MapPin,
  CalendarDays,
  Trophy,
  Mountain,
  Bike,
  Clock,
  Camera,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileWarning,
  ArrowRight,
  Users,
  ChevronDown,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  lookupRegistration,
  type PublicRegistration,
  type PublicCounts,

} from "@/lib/registrations.functions";
import heroAsset from "@/assets/mcf-mdyrr.jpg.asset.json";
import mcfLogo from "@/assets/mcf-mcf-logo.png.asset.json";
import imgRoadRace from "@/assets/mcf-rr.jpg.asset.json";
import imgCriterium from "@/assets/mcf-criterium.png.asset.json";
import imgAction from "@/assets/mcf-action.png.asset.json";
import imgStart from "@/assets/mcf-start.jpg.asset.json";
import imgAwards from "@/assets/mcf-awards.png.asset.json";
import gnlmClipping from "@/assets/gnlm-8june2026.png.asset.json";
import routeHlegu from "@/assets/mcf-route-hlegu.png.asset.json";
import routeCriterium from "@/assets/mcf-route-criterium.png.asset.json";

const heroImage = heroAsset.url;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MCF National Cycling Event 2026 — 26–28 June, Yangon" },
      {
        name: "description",
        content:
          "Official microsite for the 2026 64th Myanmar Cycling Federation National Cycling Event (တံခွန်စိုက်ဖလားပြိုင်ပွဲ) — 26–28 June 2026, Hlegu 11 Hills Round  / Taikkyi / Thuwunna.",
      },
      { property: "og:title", content: "MCF National Cycling Event 2026" },
      {
        property: "og:description",
        content:
          "၂၀၂၆ ခုနှစ် (၆၄) ကြိမ်မြောက် \n စက်ဘီး တံခွန်စိုက်ဖလားပြိုင်ပွဲ — Road Race · MTB XCO · Criterium.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MicrositePage,
});

const REGISTER_PATH = "/register" as const;

const EVENTS = ["all", "Road Race", "Criterium", "MTB XCO"];
const STATUSES = [
  "all",
  "Registration received - pending MCF verification",
  "Pending",
  "Needs correction",
  "Duplicate / under review",
  "Confirmed for provisional start list",
];

const STATUS_LABEL: Record<string, string> = {
  all: "အားလုံး / All statuses",
  "Registration received - pending MCF verification": "လက်ခံပြီး — MCF စိစစ်ဆဲ",
  Pending: "စောင့်ဆိုင်းဆဲ",
  "Needs correction": "ပြင်ဆင်ရန် လိုအပ်",
  "Duplicate / under review": "ထပ်နေသည် / ပြန်စစ်ဆဲ",
  "Confirmed for provisional start list": "ယာယီ Start List အတည်ပြုပြီး",
};

const EVENT_LABEL: Record<string, string> = {
  all: "အားလုံး / All events",
  "Road Race": "Road Race",
  Criterium: "Criterium",
  "MTB XCO": "MTB XCO",
};

const NAV = [
  { id: "overview", my: "ပင်မ", en: "Overview" },
  { id: "status", my: "စာရင်း", en: "Status" },
  { id: "events", my: "ပြိုင်ပွဲများ", en: "Events" },
  { id: "points", my: "အမှတ်", en: "Points" },
  { id: "organisers", my: "အဖွဲ့", en: "Organisers" },
  { id: "gallery", my: "ဓာတ်ပုံ", en: "Gallery" },
  { id: "sponsors", my: "ပံ့ပိုးသူ", en: "Sponsors" },
  { id: "media", my: "သတင်း", en: "Media" },
];

function statusBadgeClass(status: string | null): string {
  if (!status) return "bg-muted text-muted-foreground";
  if (status.startsWith("Confirmed")) return "bg-primary/15 text-primary";
  if (status === "Needs correction" || status.startsWith("Duplicate"))
    return "bg-destructive/15 text-destructive";
  return "bg-muted text-muted-foreground";
}

function MicrositePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <Hero />
        <ProgrammeAtAGlance />
        <RouteReferences />
        <NoticeBanner />
        <RegistrationStatus />
        <EventsSection />
        <PointsSection />
        <OrganisersSection />
        <GallerySection />
        <SponsorsSection />
        <MediaSection />
      </main>
      <SiteFooter />
    </div>
  );
}

/* SiteNav removed — global header lives in src/components/SiteHeader.tsx */

/* ─── Hero ─────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      id="overview"
      className="relative isolate min-h-[80svh] overflow-hidden text-white"
    >
      <img
        src={heroImage}
        alt=""
        width={1920}
        height={1080}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--mcf-navy-deep) 92%, transparent) 0%, color-mix(in oklab, var(--mcf-navy) 70%, transparent) 60%, color-mix(in oklab, var(--mcf-navy-deep) 80%, transparent) 100%)",
        }}
      />
      <div className="mx-auto flex min-h-[80svh] max-w-6xl flex-col justify-center px-4 py-16 sm:py-24">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm uppercase tracking-[0.2em] text-white/80">
          <span lang="my" className="tracking-normal normal-case">
            မြန်မာနိုင်ငံ စက်ဘီးအဖွဲ့ချုပ်
          </span>
          <span aria-hidden>·</span>
          <span>Myanmar Cycling Federation</span>
        </p>
        <h1
          lang="my"
          className="mt-4 max-w-full break-words text-3xl font-bold leading-[1.25] sm:text-4xl md:text-5xl lg:text-6xl"
        >
          ၂၀၂၆ ခုနှစ် (၆၄) ကြိမ်မြောက်
          <br />
          &nbsp;စက်ဘီး တံခွန်စိုက်ဖလားပြိုင်ပွဲ
        </h1>
        <p className="mt-3 max-w-2xl text-base sm:text-lg text-white/85">
          Myanmar Cycling Federation National Cycling Event 2026
        </p>

        <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm sm:text-base">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-white/80" />
            <dt className="sr-only">Dates</dt>
            <dd className="font-medium">26 – 28 June 2026</dd>
          </div>
          <div className="flex items-start gap-2 max-w-full">
            <MapPin className="h-4 w-4 mt-0.5 text-white/80 shrink-0" />
            <dt className="sr-only">Venues</dt>
            <dd className="font-medium break-words">
              Hlegu 11 Hills Round  · Taikkyi Mirror Mountains · Thuwunna
            </dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <a
            href="#status"
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-lg hover:opacity-95"
          >
            Check Registration Status
          </a>
          <Link
            to={REGISTER_PATH}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20"
          >
            Register Now
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── Race Programme at a glance ──────────────────────────────────────────── */
function ProgrammeAtAGlance() {
  const days = [
    {
      date: "26 June 2026",
      my: "ဇွန် ၂၆",
      time: "07:00",
      title: "Road Race",
      venue: "Hlegu 11 Hills Round ",
      type: "Points event",
      icon: Bike,
      anchor: "#26-June-2026",
    },
    {
      date: "27 June 2026",
      my: "ဇွန် ၂၇",
      time: "07:00",
      title: "MTB XCO",
      venue: "Taikkyi Mirror Mountains",
      type: "Separate event",
      icon: Mountain,
      anchor: "#27-June-2026",
    },
    {
      date: "28 June 2026",
      my: "ဇွန် ၂၈",
      time: "06:30 onward",
      title: "Criterium + Awards",
      venue: "Thuwunna",
      type: "Points event + Ceremony",
      icon: Trophy,
      anchor: "#28-June-2026",
    },
  ];
  return (
    <section className="bg-background border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Race Programme at a glance
            </p>
            <h2
              lang="my"
              className="mt-1 text-2xl sm:text-3xl font-bold text-primary break-words max-w-full"
            >
              ၂၆ – ၂၈ ဇွန် ၂၀၂၆ အစီအစဉ်
            </h2>
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            <Link
              to="/schedule"
              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 hover:bg-muted"
            >
              <CalendarDays className="h-4 w-4" /> Full schedule
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to="/technical-guide"
              className="inline-flex items-center gap-1 rounded-md border border-input bg-background px-3 py-2 hover:bg-muted"
            >
              <BookOpen className="h-4 w-4" /> Technical Guide
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="mt-3 inline-flex items-start gap-2 rounded-md border border-l-4 border-l-accent bg-accent/5 px-3 py-2 text-xs">
          <FileWarning className="h-3.5 w-3.5 mt-0.5 text-accent shrink-0" />
          <span>
            <span className="font-semibold">Working Draft v1</span>
            <span className="text-muted-foreground">
              {" "}
              — Final Team Version pending. /{" "}
              <span lang="my">
                ပထမအဆင့် မူကြမ်း — Final Team Version ထုတ်ပြန်ရန် ကျန်ပါသည်။
              </span>
            </span>
          </span>
        </div>

        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {days.map((d) => {
            const Icon = d.icon;
            return (
              <li key={d.date}>
                <Link
                  to="/schedule"
                  hash={d.anchor.slice(1)}
                  className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent">
                      {d.type}
                    </span>
                  </div>
                  <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {d.date} · <span lang="my">{d.my}</span>
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-accent">{d.time}</p>
                  <p className="mt-1 text-lg font-bold text-primary">{d.title}</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {d.venue}
                  </p>
                  <span className="mt-auto pt-3 text-xs text-accent inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                    View schedule <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ─── Route reference images ──────────────────────────────────────────────── */
function RouteReferences() {
  const routes = [
    {
      img: routeHlegu.url,
      title: "Road Race — Hlegu 11 Hills Round  (reference)",
      caption:
        "Hlegu 11 Hills Round  → Phukyi roundabout out / back · 100.98 km · 806 m elevation gain",
      alt: "Hlegu 11 Hills Round  Road Race reference map — Hlegu 11 Hills Round  to Phukyi roundabout, 100.98 km, 806 m elevation gain",
    },
    {
      img: routeCriterium.url,
      title: "Criterium — Thuwunna outer ring (reference)",
      caption: "Closed circuit around Thuwunna Stadium · 1.3 km / lap",
      alt: "Thuwunna Criterium reference aerial — outer-ring closed circuit, 1.3 km per lap",
    },
  ];
  return (
    <section className="bg-muted/30 border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              Route references
            </p>
            <h2
              lang="my"
              className="mt-1 text-2xl sm:text-3xl font-bold text-primary break-words"
            >
              လမ်းကြောင်းများ
            </h2>
          </div>
          <Link
            to="/technical-guide"
            hash="routes"
            className="text-sm text-accent inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            Full route details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {routes.map((r) => (
            <li key={r.title}>
              <figure className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                <img
                  src={r.img}
                  alt={r.alt}
                  loading="lazy"
                  className="w-full h-56 sm:h-64 object-cover"
                />
                <figcaption className="px-4 py-3 text-xs">
                  <p className="font-semibold text-primary">{r.title}</p>
                  <p className="mt-0.5 text-muted-foreground">{r.caption}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Reference images for orientation only. Final Route Book, GPX, hazard
          list and feed zones — Pending in Final Team Version.
        </p>
      </div>
    </section>
  );
}


/* ─── Official Notice ─────────────────────────────────────────────────────── */
function NoticeBanner() {
  return (
    <section className="bg-[color:var(--mcf-cream)] border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-md border-l-4 border-l-accent bg-card p-5 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
            တရားဝင်ကြေညာချက် · Official Notice
          </p>
          <p lang="my" className="mt-2 text-sm sm:text-base leading-relaxed">
            ဤစာရင်းသည် Registration Received List သာ ဖြစ်ပါသည်။ Final Start List
            မဟုတ်သေးပါ။ Final Start List ကို MCF မှ category, age, event, MCF/UCI
            ID နှင့် eligibility စိစစ်ပြီးနောက် ထပ်မံကြေညာပေးသွားမည်ဖြစ်ပါသည်။
          </p>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            This is the Registration Received List only — not the Final Start List.
            MCF will publish the Final Start List after verifying category, age,
            event, MCF/UCI ID and eligibility.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Registration Status (existing lookup, repackaged) ───────────────────── */
function RegistrationStatus() {
  const lookup = useServerFn(lookupRegistration);
  const [query, setQuery] = useState("");
  const [event, setEvent] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [counts, setCounts] = useState<PublicCounts | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["registrations", { query, event, status, page }],
    queryFn: () =>
      lookup({
        data: { query, event, status, page, withCounts: counts === null },
      }),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.counts && counts === null) setCounts(data.counts);
  }, [data, counts]);

  const rows: PublicRegistration[] = data?.rows ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 50;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section id="status" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader
          eyebrow="Registration Status"
          my="မှတ်ပုံတင်လက်ခံပြီး စာရင်း"
          en="Registration Received List"
          description="Search by Myanmar name, English name, team, event, or phone. Phone search runs server-side; phone numbers are never displayed."
        />

        {/* Summary cards */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <StatCard label="Total" my="စုစုပေါင်း" value={counts?.total} accent />
          <StatCard label="Road Race" my="Road Race" value={counts?.roadRace} />
          <StatCard label="Criterium" my="Criterium" value={counts?.criterium} />
          <StatCard label="MTB XCO" my="MTB XCO" value={counts?.mtbXco} />
          <StatCard
            label="Pending"
            my="စိစစ်ဆဲ"
            value={counts?.pending}
            className="col-span-2 sm:col-span-1"
          />
        </div>

        {/* Filters */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
          <div>
            <label htmlFor="q" className="block text-xs font-medium mb-1">
              <span lang="my">ရှာဖွေရန်</span>{" "}
              <span className="text-muted-foreground">/ Search</span>
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                id="q"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="အမည် / English name / team / reg no / phone"
                className="w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                aria-label="Search registrations"
              />
            </div>
          </div>
          <div>
            <label htmlFor="ev" className="block text-xs font-medium mb-1">
              <span lang="my">ပြိုင်ပွဲ</span>{" "}
              <span className="text-muted-foreground">/ Event</span>
            </label>
            <select
              id="ev"
              value={event}
              onChange={(e) => {
                setEvent(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {EVENTS.map((e) => (
                <option key={e} value={e}>
                  {EVENT_LABEL[e] ?? e}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="st" className="block text-xs font-medium mb-1">
              <span lang="my">အခြေအနေ</span>{" "}
              <span className="text-muted-foreground">/ Status</span>
            </label>
            <select
              id="st"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s] ?? s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden mt-6 space-y-3">
          {rows.length === 0 && !isFetching && <EmptyState />}
          {rows.map((r) => (
            <article
              key={r.registration_no}
              className="rounded-lg border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {r.registration_no}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-medium ${statusBadgeClass(r.status)}`}
                >
                  {r.status ?? "—"}
                </span>
              </div>
              <div className="mt-2 text-base font-semibold" lang="my">
                {r.name ?? "—"}
              </div>
              {r.english_name && (
                <div className="text-sm text-muted-foreground">{r.english_name}</div>
              )}
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Team / Club: </span>
                {r.team_club ?? "—"}
              </div>
              {r.events && r.events.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.events.map((ev) => (
                    <span
                      key={ev}
                      className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px]"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              )}
              {r.admin_remark && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {r.admin_remark}
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block mt-6 rounded-lg border border-border overflow-x-auto bg-card">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Reg No</th>
                <th className="px-3 py-2.5 font-semibold">
                  <span lang="my">အမည်</span> / Name
                </th>
                <th className="px-3 py-2.5 font-semibold">English Name</th>
                <th className="px-3 py-2.5 font-semibold">Team / Club</th>
                <th className="px-3 py-2.5 font-semibold">Events</th>
                <th className="px-3 py-2.5 font-semibold">Status</th>
                <th className="px-3 py-2.5 font-semibold">Remark</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !isFetching && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-muted-foreground"
                  >
                    <span lang="my">မှတ်ပုံတင်စာရင်း မတွေ့ပါ။</span> No
                    registrations found.
                  </td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr
                  key={r.registration_no}
                  className={`border-t border-border ${i % 2 ? "bg-muted/20" : ""}`}
                >
                  <td className="px-3 py-2 font-mono text-xs">
                    {r.registration_no}
                  </td>
                  <td className="px-3 py-2" lang="my">
                    {r.name ?? "—"}
                  </td>
                  <td className="px-3 py-2">{r.english_name ?? "—"}</td>
                  <td className="px-3 py-2">{r.team_club ?? "—"}</td>
                  <td className="px-3 py-2">
                    {r.events && r.events.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {r.events.map((ev) => (
                          <span
                            key={ev}
                            className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px]"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-medium ${statusBadgeClass(r.status)}`}
                    >
                      {r.status ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {r.admin_remark ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            {isFetching ? (
              <span lang="my">ဖွင့်နေသည်…</span>
            ) : (
              <>
                <span lang="my">စုစုပေါင်း</span> {total}{" "}
                result{total === 1 ? "" : "s"}
              </>
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-md border border-input px-3 py-1.5 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span lang="my">ရှေ့</span>
            </button>
            <span className="text-muted-foreground">
              <span lang="my">စာမျက်နှာ</span> {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="inline-flex items-center gap-1 rounded-md border border-input px-3 py-1.5 disabled:opacity-50"
            >
              <span lang="my">နောက်</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  my,
  value,
  accent,
  className,
}: {
  label: string;
  my: string;
  value: number | undefined;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border bg-card p-4 ${accent ? "border-accent/40" : "border-border"} ${className ?? ""}`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span lang="my" className="text-[11px] text-muted-foreground truncate">
          {my}
        </span>
      </div>
      <div
        className={`mt-1 text-2xl sm:text-3xl font-bold tabular-nums ${accent ? "text-accent" : "text-primary"}`}
      >
        {value === undefined ? "—" : value.toLocaleString()}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-md border border-border bg-card p-6 text-center text-sm text-muted-foreground">
      <span lang="my">မှတ်ပုံတင်စာရင်း မတွေ့ပါ။</span>
      <div className="mt-1">No registrations found.</div>
    </div>
  );
}

/* ─── Section header ──────────────────────────────────────────────────────── */
function SectionHeader({
  eyebrow,
  my,
  en,
  description,
}: {
  eyebrow: string;
  my: string;
  en: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        {eyebrow}
      </p>
      <h2
        lang="my"
        className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight break-words max-w-full text-primary"
      >
        {my}
      </h2>
      <p className="mt-1 text-sm sm:text-base text-muted-foreground">{en}</p>
      {description && (
        <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

/* ─── Events ──────────────────────────────────────────────────────────────── */
function EventsSection() {
  const events = [
    {
      title: "Road Race",
      my: "Road Race",
      date: "26 June 2026",
      venue: "Hlegu 11 Hills Round ",
      icon: Bike,
      points: true,
      note: "Counts toward တံခွန်စိုက်ဖလား points.",
    },
    {
      title: "MTB XCO",
      my: "MTB XCO",
      date: "27 June 2026",
      venue: "Taikkyi Mirror Mountains",
      icon: Mountain,
      points: false,
      note: "Separate event — not counted for တံခွန်စိုက်ဖလား points.",
    },
    {
      title: "Criterium",
      my: "Criterium",
      date: "28 June 2026",
      venue: "Thuwunna",
      icon: Trophy,
      points: true,
      note: "Grand stand award ceremony after the criterium events.",
    },
  ];
  return (
    <section id="events" className="bg-[color:var(--mcf-cream)] border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader
          eyebrow="Event Details"
          my="ပြိုင်ပွဲ အသေးစိတ်"
          en="Three days. Three disciplines."
        />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {events.map((e) => {
            const Icon = e.icon;
            return (
              <article
                key={e.title}
                className="group flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      e.points
                        ? "bg-accent/15 text-accent"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {e.points ? "Points Event" : "Separate Event"}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-primary">{e.title}</h3>
                <dl className="mt-3 space-y-1.5 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <dd>{e.date}</dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                    <dd className="break-words">{e.venue}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {e.note}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Points classification ───────────────────────────────────────────────── */
function PointsSection() {
  return (
    <section id="points" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader
          eyebrow="Points Classification"
          my="အမှတ်တွက်ချက်ပုံ"
          en="What counts toward တံခွန်စိုက်ဖလား points"
        />
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-accent/30 bg-card p-6 shadow-sm border-l-4 border-l-accent">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              <h3 className="text-lg font-bold text-primary">
                Counts for{" "}
                <span lang="my">တံခွန်စိုက်ဖလား</span> Points
              </h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Bike className="h-4 w-4 text-accent" /> Road Race — 26 June
              </li>
              <li className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-accent" /> Criterium — 28 June
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Mountain className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-bold text-primary">
                Separate / Open Events
              </h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mountain className="h-4 w-4" /> MTB XCO — 27 June
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> Special open events (announced separately)
              </li>
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              These events do not count toward{" "}
              <span lang="my">တံခွန်စိုက်ဖလား</span> points.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Organisers / Governance ─────────────────────────────────────────────── */
type Organiser = {
  role: string;
  roleMy?: string;
  name: string;
  fn: string;
};

const ORGANISERS_PRIMARY: Organiser[] = [
  { role: "President / Chair", roleMy: "ဥက္ကဋ္ဌ", name: "U Khin Maung Win", fn: "Strategic direction and final federation oversight." },
  { role: "Venue / Government Sports Authority Coordination", roleMy: "အားကစားဝန်ကြီးဌာန ဆက်သွယ်ရေး", name: "U Kyaw Min Than — Yangon Region Sports Director, Ministry of Sports", fn: "Venue, state coordination, government support, official sports authority coordination." },
  { role: "Ministry Sports Coordination / Operations Liaison", roleMy: "လုပ်ငန်းဆက်သွယ်ရေး", name: "Ko Linn Linn", fn: "Assisting U Kyaw Min Than with coordination among relevant authorities, venue arrangements, logistics support, and operational follow-up." },
  { role: "Vice President / Oversight", roleMy: "ဒုဥက္ကဋ္ဌ — ကြီးကြပ်", name: "U Myat Thu", fn: "Senior federation oversight and advisory role, subject to availability." },
  { role: "Vice President / Event Director", roleMy: "ဒုဥက္ကဋ္ဌ — ပွဲဦးစီး", name: "Ken Tun", fn: "Overall event execution, coordination, planning, and delivery." },
  { role: "Secretary General", roleMy: "အထွေထွေအတွင်းရေးမှူး", name: "Ko Myo Than Tun", fn: "Official administration, meeting records, documentation, federation coordination." },
  { role: "Finance", roleMy: "ဘဏ္ဍာရေး", name: "U Aung Naing Moe", fn: "Budget control, payments, procurement, cash prize preparation, financial reporting." },
  { role: "PCP / Race Technical Authority", roleMy: "နည်းပညာ အကြီးအကဲ", name: "Ko Naing", fn: "Race technical authority, commissaire control, penalties, protests, result certification." },
  { role: "Commissaire Panel", roleMy: "ဒိုင်လူကြီးအဖွဲ့", name: "Appointed Commissaires", fn: "Race control, technical decisions, penalties, protests, results." },
  { role: "Safety Manager", roleMy: "လုံခြုံရေး မန်နေဂျာ", name: "Lianpanga", fn: "Safety plan, risk control, marshal / medical coordination." },
];

const ORGANISERS_SUPPORT: Organiser[] = [
  { role: "Safety Support", name: "TBC", fn: "Field safety coordination support." },
  { role: "Finish Judge", name: "TBC", fn: "Finish order and finish-line control." },
  { role: "Timing / Results", name: "Timing Team", fn: "RFID timing, backup timing, lap counting, results." },
  { role: "Registration / Admin", name: "Admin Team", fn: "Registration, sign-on, start-list support." },
  { role: "Marshal / Security", name: "Field Team", fn: "Route control, crowd control, rider safety." },
  { role: "Medical", name: "Medical Team", fn: "First aid, ambulance, emergency response." },
  { role: "Logistics", name: "Ops Team", fn: "Equipment, transport, race materials." },
  { role: "Media / Sponsor", name: "Media Team", fn: "Public communication, sponsor booths, media coordination." },
];

function OrganiserTable({ rows, startIndex = 1 }: { rows: Organiser[]; startIndex?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Desktop table */}
      <table className="hidden md:table w-full text-sm">
        <thead className="bg-primary text-primary-foreground">
          <tr>
            <th className="px-4 py-3 text-left w-12">#</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Function</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.role + i} className="border-t border-border odd:bg-background even:bg-muted/30">
              <td className="px-4 py-3 align-top font-mono text-xs text-accent font-semibold">{startIndex + i}</td>
              <td className="px-4 py-3 align-top">
                <div className="font-semibold text-primary">{r.role}</div>
                {r.roleMy && <div lang="my" className="text-xs text-muted-foreground mt-0.5">{r.roleMy}</div>}
              </td>
              <td className="px-4 py-3 align-top font-medium">{r.name}</td>
              <td className="px-4 py-3 align-top text-muted-foreground">{r.fn}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Mobile cards */}
      <ul className="md:hidden divide-y divide-border">
        {rows.map((r, i) => (
          <li key={r.role + i} className="p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
                {startIndex + i}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-primary">{r.role}</div>
                {r.roleMy && <div lang="my" className="text-xs text-muted-foreground">{r.roleMy}</div>}
                <div className="mt-1 text-sm font-medium">{r.name}</div>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{r.fn}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OrganisersSection() {
  const [open, setOpen] = useState(false);
  return (
    <section id="organisers" className="bg-muted/20 border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
          <Users className="h-4 w-4" />
          <span>Governance</span>
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-primary">
          <span lang="my">စီစဉ်ကျင်းပရေးအဖွဲ့</span>
          <span className="text-muted-foreground"> · </span>
          Meet the Organisers
        </h2>
        <p lang="my" className="mt-4 max-w-3xl text-sm sm:text-base text-foreground/80 leading-relaxed">
          ၂၀၂၆ ခုနှစ် (၆၄) ကြိမ်မြောက် မြန်မာနိုင်ငံ စက်ဘီး တံခွန်စိုက်ဖလားပြိုင်ပွဲအား မြန်မာနိုင်ငံ စက်ဘီးအဖွဲ့ချုပ်၊ အားကစားဝန်ကြီးဌာနနှင့် သက်ဆိုင်ရာ တာဝန်ရှိသူများ ပူးပေါင်းဆောင်ရွက်၍ ကျင်းပသွားမည်ဖြစ်ပါသည်။
        </p>

        <div className="mt-8">
          <OrganiserTable rows={ORGANISERS_PRIMARY} startIndex={1} />
        </div>

        <Collapsible open={open} onOpenChange={setOpen} className="mt-6">
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left shadow-sm hover:bg-muted/40 transition-colors">
            <div>
              <div className="text-sm font-semibold text-primary">
                Operations Support Teams
              </div>
              <div lang="my" className="text-xs text-muted-foreground">
                လုပ်ငန်းဆောင်ရွက်ရေး အထောက်အကူပြုအဖွဲ့များ
              </div>
            </div>
            <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <OrganiserTable rows={ORGANISERS_SUPPORT} startIndex={11} />
          </CollapsibleContent>
        </Collapsible>

        <div className="mt-8 rounded-xl border-l-4 border-l-accent border border-border bg-card p-5 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">
            Governance note
          </div>
          <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
            The President provides strategic direction and final federation oversight.
            U Kyaw Min Than and Ko Linn Linn support government, venue, authority
            coordination and logistics arrangements. The Event Director manages
            overall execution. Race decisions, penalties, protests and final results
            remain under the authority of the PCP and Commissaire Panel. Safety
            planning is coordinated by the Safety Manager with the Event Director,
            PCP, medical, marshal and traffic/security teams.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Gallery ─────────────────────────────────────────────────────────────── */

function GallerySection() {
  const cards: { label: string; src?: string }[] = [
    { label: "Road Race", src: imgRoadRace.url },
    { label: "Criterium", src: imgCriterium.url },
    { label: "Cycling Action", src: imgAction.url },
    { label: "Race Start", src: imgStart.url },
    { label: "Awards", src: imgAwards.url },
    { label: "MTB XCO" }, // neutral placeholder until a true MTB XCO photo is available
  ];
  return (
    <section id="gallery" className="bg-[color:var(--mcf-cream)] border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader
          eyebrow="Event Photos"
          my="ဓာတ်ပုံများ"
          en="Gallery — archive photos from the Myanmar Cycling Federation."
        />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {cards.map(({ label, src }) => (
            <figure
              key={label}
              className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-card shadow-sm"
            >
              {src ? (
                <>
                  <img
                    src={src}
                    alt={label}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-3">
                    <figcaption className="text-xs sm:text-sm font-semibold text-white">
                      {label}
                    </figcaption>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, color-mix(in oklab, var(--mcf-navy) 90%, transparent), color-mix(in oklab, var(--mcf-navy-deep) 95%, transparent))",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90 p-3 text-center">
                    <Camera className="h-5 w-5 opacity-70" />
                    <figcaption className="mt-2 text-xs sm:text-sm font-medium">
                      {label}
                    </figcaption>
                    <span className="mt-1 text-[10px] uppercase tracking-wider text-white/60">
                      Photo coming soon
                    </span>
                  </div>
                </>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Sponsors / Event Village ────────────────────────────────────────────── */
import mspCatLogo from "@/assets/msp-cat-logo.jpg.asset.json";
import easyGasLogo from "@/assets/easy-gas-logo.png.asset.json";
import bbChickenLogo from "@/assets/bb-chicken-collagen-broth.png.asset.json";
import focusCoreLogo from "@/assets/focuscore-logo.jpg.asset.json";
import sportsGearTradingLogo from "@/assets/sports-gear-trading-logo.png.asset.json";

const partnerSponsors = [
  { name: "Easy Gas", logo: easyGasLogo.url },
  { name: "BB Chicken Collagen Broth", logo: bbChickenLogo.url },
  { name: "FocusCore", logo: focusCoreLogo.url },
  { name: "Sports Gear Trading", logo: sportsGearTradingLogo.url },
];

function SponsorsSection() {
  const emptySlots = Math.max(0, 8 - partnerSponsors.length);

  return (
    <section id="sponsors" className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader
          eyebrow="Sponsors & Event Village"
          my="ပံ့ပိုးသူများ နှင့် Event Village"
          en="Sponsor booths and partner activities — especially on 28 June at Thuwunna."
        />

        {/* Main Sponsor */}
        <div className="mt-8">
          <div className="text-center mb-3">
            <span className="inline-block text-[11px] uppercase tracking-[0.2em] text-primary font-semibold border-b-2 border-accent pb-1">
              အဓိက ပံ့ပိုးသူ / Main Sponsor
            </span>
          </div>
          <div className="rounded-xl border-2 border-primary bg-card p-4 sm:p-6 shadow-sm flex items-center justify-center">
            <img
              src={mspCatLogo.url}
              alt="MSP | CAT — Main Sponsor of the 64th Myanmar National Cycling Championships 2026"
              className="max-h-32 sm:max-h-40 w-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>

        {/* Partner Sponsors */}
        <div className="mt-10">
          <div className="text-center mb-3">
            <span className="inline-block text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              ပါတနာ ပံ့ပိုးသူများ / Partner Sponsors
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {partnerSponsors.map((s) => (
              <div
                key={s.name}
                className="aspect-[3/2] rounded-lg border border-border bg-card flex items-center justify-center p-3 shadow-sm"
              >
                <img
                  src={s.logo}
                  alt={`${s.name} — Partner Sponsor`}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
            {Array.from({ length: emptySlots }, (_, i) => i + 1).map((n) => (
              <div
                key={`slot-${n}`}
                className="aspect-[3/2] rounded-lg border border-dashed border-border bg-card flex items-center justify-center text-center px-3"
              >
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Sponsor Slot
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-muted-foreground text-center">
            Additional sponsor logos will be added here as partners are confirmed.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Media ───────────────────────────────────────────────────────────────── */
function MediaSection() {
  return (
    <section id="media" className="bg-[color:var(--mcf-cream)] border-y border-border">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <SectionHeader
          eyebrow="Media Coverage"
          my="သတင်းမီဒီယာ"
          en="Featured in Mainstream Media"
        />
        <article className="mt-8 grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-4 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <a
            href={gnlmClipping.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block bg-white"
          >
            <img
              src={gnlmClipping.url}
              alt="The Global New Light of Myanmar — Sports page, 8 June 2026, featuring the 64th MCF National Cycling Event"
              loading="lazy"
              className="w-full h-full object-contain md:object-cover md:aspect-auto aspect-[4/3]"
            />
          </a>
          <div className="p-5 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              Featured Story
            </p>
            <h3 className="mt-2 text-lg sm:text-xl font-bold text-primary leading-snug">
              MCF National Cycling Event featured in The Global New Light of
              Myanmar
            </h3>
            <p lang="my" className="mt-3 text-sm leading-relaxed">
              ၂၀၂၆ ခုနှစ် (၆၄) ကြိမ်မြောက် တံခွန်စိုက်ဖလားပြိုင်ပွဲကို The Global
              New Light of Myanmar သတင်းစာ၏ အားကစားကဏ္ဍတွင် ၂၀၂၆ ခုနှစ် ဇွန်လ ၈
              ရက်နေ့တွင် ဖော်ပြခဲ့ပါသည်။
            </p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              The event was featured in the sports section of The Global New
              Light of Myanmar on 8 June 2026.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────────────────── */
function SiteFooter() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="bg-[color:var(--mcf-navy-deep)] text-white/85">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-white p-1">
              <img src={mcfLogo.url} alt="MCF logo" className="h-full w-full object-contain" />
            </span>
            <div className="leading-tight">
              <p className="font-semibold">Myanmar Cycling Federation</p>
              <p lang="my" className="text-xs text-white/70">
                မြန်မာနိုင်ငံ စက်ဘီးအဖွဲ့ချုပ်
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-white/70 leading-relaxed">
            Official microsite for the 2026 (64th) National Cycling Event —
            <span lang="my">
              {" "}
              တံခွန်စိုက်ဖလားပြိုင်ပွဲ
            </span>
            .
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
            Official Registration
          </p>
          <Link
            to={REGISTER_PATH}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-95"
          >
            Open Registration Form
          </Link>
          <p className="mt-3 text-xs text-white/60">
            Official MCF registration — no Google account required.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
            Quick Links
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
            {NAV.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="text-white/80 hover:text-white"
                >
                  {n.en}
                </a>
              </li>
            ))}
            <li>
              <Link to="/schedule" className="text-white/80 hover:text-white">
                Schedule
              </Link>
            </li>
            <li>
              <Link
                to="/technical-guide"
                className="text-white/80 hover:text-white"
              >
                Technical Guide
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-white/60">
          © {year} Myanmar Cycling Federation
        </div>
      </div>
    </footer>
  );
}
