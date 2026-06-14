import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarDays,
  FileWarning,
  Gavel,
  Map as MapIcon,
  ScrollText,
  Shield,
  ShieldAlert,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import routeHlegu from "@/assets/mcf-route-hlegu.png.asset.json";
import routeCriterium from "@/assets/mcf-route-criterium.png.asset.json";

const REGISTER_PATH = "/register" as const;

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      {
        title:
          "Technical Guide / နည်းပညာလမ်းညွှန် — MCF National Cycling Event 2026",
      },
      {
        name: "description",
        content:
          "Working Draft v1 of the Technical Guide for the 2026 64th MCF National Cycling Event — overview, routes, categories, points, prize money, officials, procedures, protests. Final Team Version pending.",
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
  { id: "prizes", my: "ပြိုင်ပွဲဆုကြေးများ", en: "Prize Money" },
  { id: "procedures", my: "ပြိုင်ပွဲ လုပ်ထုံးလုပ်နည်း", en: "Race Procedures" },
  { id: "officials", my: "နည်းပညာအရာရှိများနှင့် ဘေးကင်းရေး", en: "Technical Officials & Safety" },
  { id: "protests", my: "အယူခံ စိစစ်မှု", en: "Protests & Appeals" },
  { id: "pending", my: "Final Version တွင် ထည့်သွင်းမည်", en: "Pending in Final Version" },
];

function TechnicalGuidePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      
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
                    <Link
                      key="reg"
                      to={REGISTER_PATH}
                      className="text-accent underline inline-flex items-center gap-1"
                    >
                      Register at cyclings.live/register
                    </Link>,
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
                Working Draft start times. Full day-by-day programme on the{" "}
                <Link to="/programme" className="text-accent underline">
                  Schedule page
                </Link>
                .
              </p>
              <DraftBanner />
              <ul className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <DayCard
                  date="26 June 2026"
                  my="ဇွန် ၂၆"
                  time="07:00"
                  title="Road Race"
                  venue="Hlegu 11 Hills Round "
                  type="Points event"
                />
                <DayCard
                  date="27 June 2026"
                  my="ဇွန် ၂၇"
                  time="07:00"
                  title="MTB XCO"
                  venue="Taikkyi Mirror Mountains"
                  type="Separate event"
                />
                <DayCard
                  date="28 June 2026"
                  my="ဇွန် ၂၈"
                  time="06:30 onward"
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
                  venue="Hlegu 11 Hills Round "
                  details={[
                    "Distance: 100.98 km",
                    "Elevation gain: 806 m",
                    "Approx. 11 climbs",
                    "Rolling course, mass start",
                    "Men Elite & Men Junior: 100 km",
                    "Women Elite / Open: 60 km",
                  ]}
                />
                <RouteCard
                  title="Criterium"
                  venue="Thuwunna outer ring"
                  details={[
                    "Circuit: 1.3 km / lap",
                    "Closed circuit, mass start",
                    "Men Junior: 15 laps / ~20 km",
                    "Women Elite/Open: 16 laps / ~21 km",
                    "Men Elite: 20 laps / ~26 km",
                    "Special Open: 15 laps (separate)",
                  ]}
                />
                <RouteCard
                  title="MTB XCO"
                  venue="We Love Taikkyi → Mirror Mountains"
                  details={[
                    "Reference segment: 1.99 km",
                    "Elevation gain: 132 m",
                    "Average gradient: 4.9%",
                    "Climb Category 4",
                    "Men Open (separate event)",
                  ]}
                />
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <RouteReferenceImage
                  src={routeHlegu.url}
                  alt="Hlegu 11 Hills Round  Road Race reference map — Hlegu 11 Hills Round  to Phukyi roundabout, 100.98 km, 806 m elevation gain"
                  title="Road Race — Hlegu 11 Hills Round  (reference)"
                  caption="Hlegu 11 Hills Round  → Phukyi roundabout out / back · 100.98 km · 806 m gain"
                />
                <RouteReferenceImage
                  src={routeCriterium.url}
                  alt="Thuwunna Criterium reference aerial — outer-ring closed circuit, 1.3 km per lap"
                  title="Criterium — Thuwunna outer ring (reference)"
                  caption="Closed circuit around Thuwunna Stadium · 1.3 km / lap"
                />
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Reference images for orientation only. Final Route Book, GPX,
                hazard list and feed zones — Pending in Final Team Version.
              </p>
            </Section>

            <Section
              id="categories"
              icon={Users}
              my="အမျိုးအစားများ နှင့် ဝင်ရောက်ခွင့်"
              en="Categories & Eligibility"
            >
              <DraftBanner />
              <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Category</th>
                      <th className="px-3 py-2 font-semibold">Eligibility</th>
                      <th className="px-3 py-2 font-semibold">Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2 font-medium">Men Elite</td>
                      <td className="px-3 py-2">Age 19+</td>
                      <td className="px-3 py-2">100 km (Road) · 20 laps (Crit)</td>
                    </tr>
                    <tr className="border-t border-border bg-muted/20">
                      <td className="px-3 py-2 font-medium">Men Junior</td>
                      <td className="px-3 py-2">
                        Age 16–18, paired start with Elite, separate classification
                      </td>
                      <td className="px-3 py-2">100 km (Road) · 15 laps (Crit)</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2 font-medium">Women Elite / Open</td>
                      <td className="px-3 py-2">Women — Elite / Open</td>
                      <td className="px-3 py-2">60 km (Road) · 16 laps (Crit)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <ul className="mt-4 list-disc pl-5 space-y-2 text-sm leading-relaxed">
                <li>
                  Date of birth (DOB), MCF / UCI license status and eligibility
                  are reviewed before the Final Start List is published.
                </li>
                <li>
                  Riders registering into the wrong category (e.g. Junior DOB
                  entering Open Men) will be reclassified by MCF.
                </li>
                <li>
                  Duplicate registrations will be merged into a single rider
                  record by MCF before the Final Start List.
                </li>
                <li>
                  Women's Elite / Open Road Race and Criterium — team
                  nominations for women riders are encouraged.
                </li>
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Final category assignments will be confirmed by MCF in the Final
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
                    <li>• Special Open Criterium — 28 June</li>
                  </ul>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Do NOT count toward <span lang="my">တံခွန်စိုက်ဖလား</span>{" "}
                    points.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-primary">
                  Team Composition & Classification
                </h3>
                <ul className="mt-2 text-sm space-y-1.5">
                  <li>• Up to 4 riders per team may enter.</li>
                  <li>
                    • Team Classification is calculated from the top 3 riders'
                    finishing positions.
                  </li>
                  <li>
                    • Road Race ties are broken by the team's highest-placed
                    rider's finishing position.
                  </li>
                </ul>

                <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
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
                <DraftBanner />
              </div>
            </Section>

            <Section
              id="prizes"
              icon={Wallet}
              my="ပြိုင်ပွဲဆုကြေးများ"
              en="Prize Money"
            >
              <DraftBanner />
              <p className="mt-3 text-sm text-muted-foreground">
                All amounts in Myanmar Kyats (MMK). Working Draft figures from
                the current Technical Guide.
              </p>
              <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Event / Category</th>
                      <th className="px-3 py-2 font-semibold">Prize (MMK)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Road Race — Men Elite 1–5", "700,000 / 500,000 / 300,000 / 200,000 / 100,000"],
                      ["Road Race — Women Elite 1–5", "700,000 / 500,000 / 300,000 / 200,000 / 100,000"],
                      ["Road Race — Men Junior 1–3", "500,000 / 300,000 / 200,000"],
                      ["Road Race — Champion Team 1–3", "1,500,000 / 1,000,000 / 500,000"],
                      ["Men Elite — Best Player", "1,000,000"],
                      ["Women Elite — Best Player", "700,000"],
                      ["Men Junior — Best Player", "500,000"],
                      ["MTB XCO — Men Open 1–5", "700,000 / 500,000 / 300,000 / 200,000 / 100,000"],
                      ["Criterium — Men/Women Elite 1–5", "700,000 / 500,000 / 300,000 / 200,000 / 100,000"],
                      ["Criterium — Men Junior 1–3", "500,000 / 300,000 / 200,000"],
                      ["Criterium — Special Open 1–5", "400,000 / 300,000 / 200,000 / 100,000 / 50,000"],
                      ["Criterium — Special Open 6–10", "Medal / commemorative award"],
                    ].map(([k, v], i) => (
                      <tr
                        key={k}
                        className={`border-t border-border ${i % 2 ? "bg-muted/20" : ""}`}
                      >
                        <td className="px-3 py-2 font-medium">{k}</td>
                        <td className="px-3 py-2">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm">
                Top 3 receive medals / trophies where applicable. Criterium
                Special Open pays the top 10.
              </p>
              <p lang="my" className="mt-1 text-xs text-muted-foreground">
                ပထမ ၃ ဦးအတွက် ဆုတံဆိပ်/ဖလားများ ထုတ်ပေးမည်။ Criterium Special Open
                ပြိုင်ပွဲတွင် ပထမ ၁၀ ဦးအထိ ဆုပေးမည်။
              </p>
            </Section>

            <Section
              id="procedures"
              icon={ScrollText}
              my="ပြိုင်ပွဲ လုပ်ထုံးလုပ်နည်း"
              en="Race Procedures"
            >
              <ol className="mt-2 list-decimal pl-5 space-y-2 text-sm leading-relaxed">
                <li>
                  <span className="font-semibold">Registration</span> — riders
                  submit the official MCF Online Registration Form before the
                  Start List approval deadline.
                </li>
                <li>
                  <span className="font-semibold">Clean Master List</span> —
                  raw registrations are cleaned (duplicates merged, DOB / category
                  verified, licenses checked) before any start list is shared.
                </li>
                <li>
                  <span className="font-semibold">Provisional Start List</span>{" "}
                  — shared with teams for review.
                </li>
                <li>
                  <span className="font-semibold">Final Start List</span> —
                  confirmed only after DOB, category, entered events, duplicate
                  check, UCI / MCF license status and eligibility are all
                  verified.
                </li>
                <li>
                  <span className="font-semibold">Sign-on / Roll Call</span> —
                  all riders complete sign-on, number check and roll call at the
                  designated time before each race.
                </li>
                <li>
                  <span className="font-semibold">Race Start</span> — Road Race
                  uses a neutral start as directed by the Commissaire Panel;
                  Criterium uses a closed-circuit mass start.
                </li>
                <li>
                  <span className="font-semibold">Timing / Lap Counting</span>{" "}
                  — Criterium uses lap counting, bell lap, lapped-rider control
                  and finish judge; Road Race uses designated feed zones.
                </li>
                <li>
                  <span className="font-semibold">Provisional Results</span>{" "}
                  — published immediately after each race.
                </li>
                <li>
                  <span className="font-semibold">Final Results</span> —
                  confirmed by the Commissaire Panel after the protest window
                  closes.
                </li>
              </ol>
              <DraftBanner />
            </Section>

            <Section
              id="officials"
              icon={Shield}
              my="နည်းပညာအရာရှိများနှင့် ဘေးကင်းရေး"
              en="Technical Officials & Safety"
            >
              <DraftBanner />
              <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Role</th>
                      <th className="px-3 py-2 font-semibold">Responsibilities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["PCP / Commissaire Panel", "Rule application, penalties, protests, results certification"],
                      ["Finish Judge", "Finish order, timing backup, result workflow"],
                      ["Medical Team", "Ambulance, first aid, emergency response"],
                      ["Marshal Team", "Course marshalling, hazard point reporting"],
                      ["Traffic / Security", "Road closure, junction control, convoy safety"],
                      ["Timing / Results", "RFID / timing, manual backup, lap counting, results publication"],
                    ].map(([role, resp], i) => (
                      <tr
                        key={role}
                        className={`border-t border-border ${i % 2 ? "bg-muted/20" : ""}`}
                      >
                        <td className="px-3 py-2 font-medium whitespace-nowrap">{role}</td>
                        <td className="px-3 py-2">{resp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 rounded-md border border-l-4 border-l-destructive/70 bg-destructive/5 p-4">
                <p className="flex items-center gap-2 font-semibold text-sm">
                  <ShieldAlert className="h-4 w-4 text-destructive" />
                  Safety rules
                </p>
                <ul className="mt-2 list-disc pl-5 space-y-1.5 text-sm">
                  <li>Helmet is mandatory at all times on course.</li>
                  <li>Ambulance standby will be in place on every race day.</li>
                  <li>Officials' instructions must be followed at all times.</li>
                  <li>
                    Unsafe riding, rule violations or unsafe conduct may lead to
                    penalty or disqualification.
                  </li>
                </ul>
              </div>
            </Section>

            <Section
              id="protests"
              icon={Gavel}
              my="အယူခံ စိစစ်မှု"
              en="Protests & Appeals"
            >
              <ul className="mt-2 list-disc pl-5 space-y-2 text-sm leading-relaxed">
                <li>Protests must be submitted by the rider's Team Manager.</li>
                <li>
                  Protest fee, review process and decision timeline will be
                  confirmed at the Team Managers Meeting.
                </li>
                <li>
                  Final authority rests with the Organising Committee and the
                  Commissaire Panel jointly, in accordance with UCI rules and
                  MCF technical decisions.
                </li>
              </ul>
              <DraftBanner />
            </Section>

            <Section
              id="pending"
              icon={FileWarning}
              my="Final Version တွင် ထည့်သွင်းမည်"
              en="Pending in Final Team Version"
            >
              <ul className="mt-2 list-disc pl-5 space-y-1.5 text-sm">
                <li>PCP and Commissaire Panel meeting agenda</li>
                <li>Race HQ contact list, sign-on time, bib issue plan</li>
                <li>Team Managers Meeting record</li>
                <li>
                  Road Route Book, GPX, final 3 km plan, hazard list, feed zone
                </li>
                <li>Criterium circuit schematic and finish zone plan</li>
                <li>Safety Plan, Medical Plan, Radio Plan, Vehicle Convoy Plan</li>
                <li>
                  Final Start List, Sign-On Sheet, Result Templates,
                  Protest / Penalty Forms
                </li>
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
  time,
  title,
  venue,
  type,
}: {
  date: string;
  my: string;
  time: string;
  title: string;
  venue: string;
  type: string;
}) {
  return (
    <li className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {date} · <span lang="my">{my}</span>
      </p>
      <p className="mt-1 font-mono text-xs text-accent">{time}</p>
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

function RouteReferenceImage({
  src,
  alt,
  title,
  caption,
}: {
  src: string;
  alt: string;
  title: string;
  caption: string;
}) {
  return (
    <figure className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-56 sm:h-64 object-cover"
      />
      <figcaption className="px-4 py-3 text-xs">
        <p className="font-semibold text-primary">{title}</p>
        <p className="mt-0.5 text-muted-foreground">{caption}</p>
      </figcaption>
    </figure>
  );
}
