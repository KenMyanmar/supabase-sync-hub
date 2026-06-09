import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, FileWarning, MapPin } from "lucide-react";
import mcfLogo from "@/assets/mcf-mcf-logo.png.asset.json";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      {
        title:
          "Schedule / အစီအစဉ် — MCF National Cycling Event 2026 (26–28 June)",
      },
      {
        name: "description",
        content:
          "Day-by-day programme (Working Draft v1) for the 2026 64th MCF National Cycling Event — Road Race 26 June, MTB XCO 27 June, Criterium and Awards 28 June. Final times TBC.",
      },
      {
        property: "og:title",
        content: "Schedule — MCF National Cycling Event 2026",
      },
      {
        property: "og:description",
        content:
          "Working Draft v1 day-by-day programme. Final times TBC by MCF.",
      },
    ],
  }),
  component: SchedulePage,
});

type Item = {
  time: string;
  event: string;
  category: string;
  venue: string;
  type: "Points" | "Separate" | "Ceremony" | "Meeting";
};

const TBC = "TBC";

const DAYS: Array<{
  date: string;
  my: string;
  heading: string;
  items: Item[];
}> = [
  {
    date: "26 June 2026",
    my: "ဇွန် ၂၆",
    heading: "Road Race — Hlegu",
    items: [
      {
        time: TBC,
        event: "Sign-on, number check, roll call",
        category: "All Road Race riders",
        venue: "Hlegu Start Area",
        type: "Meeting",
      },
      {
        time: TBC,
        event: "Road Race",
        category: "Elite / Open / Junior (M & W)",
        venue: "Hlegu rolling course",
        type: "Points",
      },
    ],
  },
  {
    date: "27 June 2026",
    my: "ဇွန် ၂၇",
    heading: "MTB XCO — Taikkyi Mirror Mountains",
    items: [
      {
        time: TBC,
        event: "Sign-on, number check, course inspection",
        category: "All MTB XCO riders",
        venue: "Taikkyi Mirror Mountains",
        type: "Meeting",
      },
      {
        time: TBC,
        event: "MTB XCO",
        category: "Open categories",
        venue: "Taikkyi Mirror Mountains",
        type: "Separate",
      },
    ],
  },
  {
    date: "28 June 2026",
    my: "ဇွန် ၂၈",
    heading: "Criterium + Awards — Thuwunna",
    items: [
      {
        time: TBC,
        event: "Sign-on, number check, roll call",
        category: "All Criterium riders",
        venue: "Thuwunna outer-loop",
        type: "Meeting",
      },
      {
        time: TBC,
        event: "Criterium",
        category: "Junior / Elite / Open (M & W)",
        venue: "Thuwunna 1.3 km circuit",
        type: "Points",
      },
      {
        time: "10:00 (Working Draft)",
        event: "Special Open Criterium",
        category: "Men's Open — 15 laps",
        venue: "Thuwunna outer-loop",
        type: "Separate",
      },
      {
        time: "11:30 (Working Draft)",
        event: "Awards Ceremony / ဆုပေးပွဲ",
        category: "All medalists",
        venue: "MCF Grounds, Thuwunna",
        type: "Ceremony",
      },
    ],
  },
];

function typeBadgeClass(t: Item["type"]) {
  switch (t) {
    case "Points":
      return "bg-accent/15 text-accent";
    case "Separate":
      return "bg-muted text-muted-foreground";
    case "Ceremony":
      return "bg-primary/10 text-primary";
    case "Meeting":
      return "bg-muted text-muted-foreground";
  }
}

function SchedulePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScheduleNav />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <header className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            <span lang="my">အစီအစဉ်</span> · Schedule
          </p>
          <h1
            lang="my"
            className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-primary break-words"
          >
            ၂၆ – ၂၈ ဇွန် ၂၀၂၆ အစီအစဉ်
          </h1>
          <p className="mt-2 text-base sm:text-lg text-muted-foreground">
            Day-by-day programme — 26 to 28 June 2026.
          </p>
          <DraftNotice />
        </header>

        <div className="mt-8 space-y-10">
          {DAYS.map((day) => (
            <section key={day.date} id={day.date.replace(/\s/g, "-")}>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-accent" />
                <h2 className="text-xl sm:text-2xl font-bold text-primary">
                  {day.date}{" "}
                  <span lang="my" className="text-base text-muted-foreground">
                    · {day.my}
                  </span>
                </h2>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{day.heading}</p>

              {/* Mobile cards */}
              <ul className="md:hidden mt-4 space-y-3">
                {day.items.map((it, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-mono text-xs text-muted-foreground">
                        {it.time}
                      </p>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeBadgeClass(it.type)}`}
                      >
                        {it.type}
                      </span>
                    </div>
                    <p className="mt-2 font-semibold">{it.event}</p>
                    <p className="text-sm text-muted-foreground">{it.category}</p>
                    <p className="mt-1 flex items-start gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span className="break-words">{it.venue}</span>
                    </p>
                  </li>
                ))}
              </ul>

              {/* Desktop table */}
              <div className="hidden md:block mt-4 rounded-lg border border-border overflow-x-auto bg-card">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="px-3 py-2.5 font-semibold w-32">Time</th>
                      <th className="px-3 py-2.5 font-semibold">Event</th>
                      <th className="px-3 py-2.5 font-semibold">Category</th>
                      <th className="px-3 py-2.5 font-semibold">Venue</th>
                      <th className="px-3 py-2.5 font-semibold w-32">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {day.items.map((it, i) => (
                      <tr
                        key={i}
                        className={`border-t border-border ${i % 2 ? "bg-muted/20" : ""}`}
                      >
                        <td className="px-3 py-2 font-mono text-xs">{it.time}</td>
                        <td className="px-3 py-2 font-medium">{it.event}</td>
                        <td className="px-3 py-2">{it.category}</td>
                        <td className="px-3 py-2 text-muted-foreground">
                          {it.venue}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeBadgeClass(it.type)}`}
                          >
                            {it.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-md border border-border bg-muted/30 p-4 text-sm">
          <p>
            <span className="font-semibold">Reminder:</span> Times marked{" "}
            <code className="px-1 rounded bg-background border border-border text-xs">
              TBC
            </code>{" "}
            are not yet confirmed. Final times will be released by MCF in the
            Final Team Version.
          </p>
          <p lang="my" className="mt-2 text-xs text-muted-foreground">
            အချိန်အသေးစိတ်များကို MCF မှ Final Team Version ထုတ်ပြန်ပြီးမှသာ
            အတည်ပြုသွားမည်ဖြစ်ပါသည်။
          </p>
        </div>

        <p className="mt-6">
          <Link
            to="/technical-guide"
            className="text-accent underline text-sm"
          >
            ← Read the full Technical Guide / နည်းပညာလမ်းညွှန်
          </Link>
        </p>
      </main>
      <ScheduleFooter />
    </div>
  );
}

function ScheduleNav() {
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
            to="/technical-guide"
            className="rounded-md px-3 py-1.5 hover:bg-muted"
          >
            Technical Guide
          </Link>
        </nav>
      </div>
    </header>
  );
}

function ScheduleFooter() {
  return (
    <footer className="bg-[color:var(--mcf-navy-deep)] text-white/80 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
        <p className="font-semibold">Myanmar Cycling Federation</p>
        <p lang="my" className="text-xs text-white/60">
          မြန်မာနိုင်ငံ စက်ဘီးအဖွဲ့ချုပ်
        </p>
        <p className="mt-3 text-xs text-white/60">
          Schedule — Working Draft v1. Final times pending in Final Team Version.
        </p>
      </div>
    </footer>
  );
}

function DraftNotice() {
  return (
    <div className="mt-4 inline-flex items-start gap-2 rounded-md border border-l-4 border-l-accent bg-accent/5 px-4 py-3 text-sm">
      <FileWarning className="h-4 w-4 mt-0.5 text-accent shrink-0" />
      <span>
        <span className="font-semibold">Working Draft v1</span>
        <span className="text-muted-foreground">
          {" "}
          — Final Team Version pending. Times marked TBC are not yet confirmed. /{" "}
          <span lang="my">
            ပထမအဆင့် မူကြမ်း — အချိန်အသေးစိတ်များ Final Team Version တွင်
            အတည်ပြုမည်။
          </span>
        </span>
      </span>
    </div>
  );
}
