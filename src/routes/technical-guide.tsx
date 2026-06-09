import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ExternalLink,
  FileWarning,
  Map as MapIcon,
  Mountain,
  ScrollText,
  Shield,
  Trophy,
  Users,
} from "lucide-react";
import mcfLogo from "@/assets/mcf-mcf-logo.png.asset.json";

const REGISTER_URL = "https://forms.gle/zi9jLZMcBTsQQnXN9";

export const Route = createFileRoute("/technical-guide")({
  head: () => ({
    meta: [
      {
        title:
          "Technical Guide / နည်းပညာလမ်းညွှန် — MCF National Cycling Event 2026",
      },
      {
        name: "description",
        content:
          "Working Draft v1 of the Technical Guide for the 2026 64th MCF National Cycling Event — overview, routes, categories, points, race procedures, protests. Final Team Version pending.",
      },
      {
        property: "og:title",
        content:
          "Technical Guide — MCF National Cycling Event 2026 (Working Draft v1)",
      },
      {
        property: "og:description",
        content:
          "နည်းပညာလမ်းညွှန် — Working Draft v1. Final Team Version pending.",
      },
    ],
  }),
  component: TechnicalGuidePage,
});

const TOC = [
  { id: "overview", my: "အကျဉ်းချုပ်", en: "Overview" },
  { id: "schedule", my: "အစီအစဉ်", en: "Schedule" },
  { id: "routes", my: "လမ်းကြောင်းများ", en: "Routes" },
  { id: "categories", my: "အမျိုးအစားများ", en: "Categories & Eligibility" },
  { id: "points", my: "အမှတ်တွက်ချက်ပုံ", en: "Points & Team Classification" },
  { id: "procedures", my: "ပြိုင်ပွဲ လုပ်ထုံးလုပ်နည်း", en: "Race Procedures" },
  { id: "protests", my: "အယူခံ စိစစ်မှု", en: "Protests & Jury" },
  { id: "pending", my: "Final Version တွင် ထည့်သွင်းမည်", en: "Pending in Final Version" },
];

function TechnicalGuidePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <GuideNav />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <header className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            <span lang="my">နည်းပညာလမ်းညွှန်</span> · Technical Guide
          </p>
          <h1
            lang="my"
            className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-primary break-words"
          >
            ၂၀၂၆ ခုနှစ် (၆၄) ကြိမ်မြောက်
            <br />
            စက်ဘီး တံခွန်စိုက်ဖလားပြိုင်ပွဲ
          </h1>
          <p className="mt-3 text-base sm:text-lg text-muted-foreground">
            Myanmar Cycling Federation National Cycling Event 2026 — Technical
            Guide
          </p>
          <DraftBanner large />
        </header>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* TOC */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span lang="my">အပိုင်းများ</span> · On this page
            </p>
            <nav className="mt-3 flex flex-col gap-1 text-sm">
              {TOC.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-md px-2 py-1.5 hover:bg-muted"
                >
                  <span className="font-medium">{s.en}</span>
                  <span lang="my" className="ml-2 text-xs text-muted-foreground">
                    {s.my}
                  </span>
                </a>
              ))}
            </nav>
          </aside>

          <div className="space-y-12 min-w-0">
            <Section id="overview" icon={BookOpen} my="အကျဉ်းချုပ်" en="Overview">
              <KvTable
                rows={[
                  [
                    "ကြီးမှူးမှု / Organising body",
                    "Ministry of Sports and Youth Affairs, led by Myanmar Cycling Federation (MCF).",
                  ],
                  [
                    "ကျင်းပမည့်ရက် / Dates",
                    "26 – 28 June 2026 / ၂၀၂၆ ခုနှစ်၊ ဇွန်လ ၂၆ – ၂၈ ရက်",
                  ],
                  [
                    "အဓိက တံခွန်စိုက်ဖလားပြိုင်ပွဲ / Main events",
                    "Road Race & Criterium (count for တံခွန်စိုက်ဖလား points).",
                  ],
                  [
                    "သီးခြားပြိုင်ပွဲ / Separate events",
                    "MTB XCO and Special Open events — separate awards only, NOT counted in တံခွန်စိုက်ဖလား points.",
                  ],
                  [
                    "Online Registration",
                    <a
                      key="reg"
                      href={REGISTER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline inline-flex items-center gap-1 break-all"
                    >
                      {REGISTER_URL}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>,
                  ],
                  [
                    "စည်းမျဉ်းမူဘောင် / Rulebook",
                    "UCI rules, MCF technical decisions and applicable local approvals.",
                  ],
                ]}
              />
            </Section>

            <Section id="schedule" icon={CalendarDays} my="အစီအစဉ်" en="Schedule">
              <p className="text-sm text-muted-foreground">
                Compact summary below. Full day-by-day programme on the{" "}
                <Link to="/schedule" className="text-accent underline">
                  Schedule page
                </Link>
                .
              </p>
              <DraftBanner />
              <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <DayCard
                  date="26 June 2026"
                  my="ဇွန် ၂၆"
                  title="Road Race"
                  venue="Hlegu"
                  type="Points event"
                />
                <DayCard
                  date="27 June 2026"
                  my="ဇွန် ၂၇"
                  title="MTB XCO"
                  venue="Taikkyi Mirror Mountains"
                  type="Separate event"
                />
                <DayCard
                  date="28 June 2026"
                  my="ဇွန် ၂၈"
                  title="Criterium + Awards"
                  venue="Thuwunna"
                  type="Points event + Ceremony"
                />
              </ul>
            </Section>

            <Section id="routes" icon={MapIcon} my="လမ်းကြောင်းများ" en="Routes">
              <DraftBanner />
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <RouteCard
                  title="Road Race"
                  venue="Hlegu"
                  details={[
                    "Rolling course",
                    "Mass start",
                    "Per-category distances: TBC",
                  ]}
                />
                <RouteCard
                  title="Criterium"
                  venue="Thuwunna outer-loop"
                  details={[
                    "Circuit: 1.3 km / lap (Working Draft)",
                    "Laps per category: TBC",
                    "Mass start",
                  ]}
                />
                <RouteCard
                  title="MTB XCO"
                  venue="Taikkyi Mirror Mountains"
                  details={[
                    "Reference segment from MCF",
                    "Final lap count: TBC",
                    "Course profile: TBC",
                  ]}
                />
              </div>
              <PlaceholderMap />
            </Section>

            <Section
              id="categories"
              icon={Users}
              my="အမျိုးအစားများ နှင့် ဝင်ရောက်ခွင့်"
              en="Categories & Eligibility"
            >
              <DraftBanner />
              <ul className="mt-4 list-disc pl-5 space-y-2 text-sm leading-relaxed">
                <li>
                  Junior, Elite and Open categories — both Men's and Women's
                  divisions where applicable.
                </li>
                <li>
                  Date of birth (DOB), MCF / UCI license status and eligibility
                  are verified before the Final Start List is published.
                </li>
                <li>
                  Riders registering into the wrong category (e.g. Junior DOB
                  entering Open Men) will be reviewed and re-classified by MCF.
                </li>
                <li>
                  Duplicate registrations will be merged into a single rider
                  record by MCF before the Final Start List.
                </li>
                <li>
                  Women's Elite / Open Road Race and Criterium — team nominations
                  for women riders are encouraged.
                </li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Final category assignments are confirmed by MCF in the Final
                Team Version.
              </p>
            </Section>

            <Section
              id="points"
              icon={Trophy}
              my="အမှတ်တွက်ချက်ပုံ နှင့် Team Classification"
              en="Points & Team Classification"
            >
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl border border-accent/30 bg-card p-5 border-l-4 border-l-accent">
                  <h3 className="font-bold text-primary">
                    Counts for <span lang="my">တံခွန်စိုက်ဖလား</span> Points
                  </h3>
                  <ul className="mt-2 text-sm space-y-1.5">
                    <li>• Road Race — 26 June</li>
                    <li>• Criterium — 28 June</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-border bg-muted/30 p-5">
                  <h3 className="font-bold text-primary">Separate / Open Events</h3>
                  <ul className="mt-2 text-sm space-y-1.5 text-muted-foreground">
                    <li>• MTB XCO — 27 June</li>
                    <li>• Special Open events (announced separately)</li>
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Do NOT count toward <span lang="my">တံခွန်စိုက်ဖလား</span>{" "}
                    points.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-primary">
                  Team Classification — Bonus Points
                </h3>
                <div className="mt-2 overflow-x-auto rounded-lg border border-border bg-card">
                  <table className="min-w-full text-sm">
                    <thead className="bg-muted/60 text-left">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Team Rank</th>
                        <th className="px-3 py-2 font-semibold">Bonus Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-border">
                        <td className="px-3 py-2">1st / ပထမ</td>
                        <td className="px-3 py-2 font-semibold">10</td>
                      </tr>
                      <tr className="border-t border-border bg-muted/20">
                        <td className="px-3 py-2">2nd / ဒုတိယ</td>
                        <td className="px-3 py-2 font-semibold">6</td>
                      </tr>
                      <tr className="border-t border-border">
                        <td className="px-3 py-2">3rd / တတိယ</td>
                        <td className="px-3 py-2 font-semibold">4</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  Team Classification is calculated from the finishing positions
                  of the team's top 3 riders. Ties in Road Race are broken by
                  the highest-placed rider's finishing position.
                </p>
                <DraftBanner />
              </div>
            </Section>

            <Section
              id="procedures"
              icon={ScrollText}
              my="ပြိုင်ပွဲ လုပ်ထုံးလုပ်နည်း"
              en="Race Procedures"
            >
              <ol className="mt-2 list-decimal pl-5 space-y-2 text-sm leading-relaxed">
                <li>
                  Riders submit the official MCF Online Registration Form before
                  the Start List approval deadline.
                </li>
                <li>
                  Raw registrations are cleaned into a Master List before any
                  Provisional Start List is shared.
                </li>
                <li>
                  Final Start List is confirmed only after DOB, category, events
                  entered, duplicate check, and UCI / MCF license + eligibility
                  status are all verified.
                </li>
                <li>
                  All riders must complete sign-on, number check and roll call
                  at the designated time before each race.
                </li>
              </ol>
              <DraftBanner />
            </Section>

            <Section
              id="protests"
              icon={Shield}
              my="အယူခံ စိစစ်မှု"
              en="Protests & Jury"
            >
              <p className="mt-2 text-sm leading-relaxed">
                All decisions are made jointly by the Organising Committee and
                the Commissaire Panel / Technical Officials in accordance with
                UCI rules and MCF technical decisions. Protest procedures and
                timing windows will be published in the Final Team Version.
              </p>
              <DraftBanner />
            </Section>

            <Section
              id="pending"
              icon={FileWarning}
              my="Final Version တွင် ထည့်သွင်းမည်"
              en="Pending in Final Team Version"
            >
              <ul className="mt-2 list-disc pl-5 space-y-1.5 text-sm">
                <li>Final Start List (per category, per event)</li>
                <li>PCP and Commissaire Panel meeting agenda</li>
                <li>Team Managers Meeting record</li>
                <li>
                  Road Route Book, GPX, final 3 km plan, hazard list, feed zone
                </li>
                <li>Safety Plan</li>
                <li>Medical Plan</li>
                <li>Results Workflow</li>
                <li>Race HQ contact list, sign-on time, bib issue plan</li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                None of the above are final on this page. They will be published
                in the Final Team Version released by MCF.
              </p>
            </Section>
          </div>
        </div>
      </main>
      <GuideFooter />
    </div>
  );
}

function GuideNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <img
            src={mcfLogo.url}
            alt="MCF logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain shrink-0"
          />
          <span className="flex flex-col leading-tight min-w-0">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
              MCF
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              National Cycling Event 2026
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 hover:bg-muted"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <Link
            to="/schedule"
            className="rounded-md px-3 py-1.5 hover:bg-muted"
          >
            Schedule
          </Link>
        </nav>
      </div>
    </header>
  );
}

function GuideFooter() {
  return (
    <footer className="bg-[color:var(--mcf-navy-deep)] text-white/80 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <p className="font-semibold">Myanmar Cycling Federation</p>
        <p lang="my" className="text-xs text-white/60">
          မြန်မာနိုင်ငံ စက်ဘီးအဖွဲ့ချုပ်
        </p>
        <p className="mt-3 text-xs text-white/60">
          Technical Guide — Working Draft v1. Final Team Version pending.
        </p>
        <p className="mt-2">
          <Link to="/" className="underline text-white/80 hover:text-white">
            ← Back to home
          </Link>
        </p>
      </div>
    </footer>
  );
}

function Section({
  id,
  icon: Icon,
  my,
  en,
  children,
}: {
  id: string;
  icon: typeof BookOpen;
  my: string;
  en: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2
            lang="my"
            className="text-xl sm:text-2xl font-bold text-primary leading-tight"
          >
            {my}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">{en}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DraftBanner({ large = false }: { large?: boolean }) {
  return (
    <div
      className={`mt-3 inline-flex items-start gap-2 rounded-md border border-l-4 border-l-accent bg-accent/5 ${
        large ? "px-4 py-3 text-sm" : "px-3 py-2 text-xs"
      } text-foreground`}
    >
      <FileWarning className={`${large ? "h-4 w-4 mt-0.5" : "h-3.5 w-3.5 mt-0.5"} text-accent shrink-0`} />
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
  );
}

function KvTable({ rows }: { rows: Array<[string, React.ReactNode]> }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="min-w-full text-sm">
        <tbody>
          {rows.map(([k, v], i) => (
            <tr
              key={k}
              className={`border-t border-border first:border-t-0 ${
                i % 2 ? "bg-muted/20" : ""
              }`}
            >
              <th className="px-3 py-2.5 text-left font-semibold align-top w-1/3 min-w-[160px]">
                {k}
              </th>
              <td className="px-3 py-2.5 align-top break-words">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DayCard({
  date,
  my,
  title,
  venue,
  type,
}: {
  date: string;
  my: string;
  title: string;
  venue: string;
  type: string;
}) {
  return (
    <li className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {date} · <span lang="my">{my}</span>
      </p>
      <p className="mt-1 font-bold text-primary">{title}</p>
      <p className="text-sm text-muted-foreground">{venue}</p>
      <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-accent">
        {type}
      </p>
    </li>
  );
}

function RouteCard({
  title,
  venue,
  details,
}: {
  title: string;
  venue: string;
  details: string[];
}) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="font-bold text-primary">{title}</h3>
      <p className="text-sm text-muted-foreground">{venue}</p>
      <ul className="mt-3 space-y-1 text-sm">
        {details.map((d) => (
          <li key={d}>• {d}</li>
        ))}
      </ul>
    </article>
  );
}

function PlaceholderMap() {
  return (
    <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
      <Mountain className="mx-auto h-6 w-6 text-muted-foreground" />
      <p className="mt-2 text-sm font-semibold">
        Route map — Pending in Final Team Version
      </p>
      <p lang="my" className="mt-1 text-xs text-muted-foreground">
        လမ်းကြောင်းမြေပုံများ — Final Team Version တွင် ထည့်သွင်းမည်။
      </p>
    </div>
  );
}
