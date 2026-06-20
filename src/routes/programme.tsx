import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, FileWarning, MapPin } from "lucide-react";

export const Route = createFileRoute("/programme")({
  head: () => ({
    meta: [
      {
        title:
          "Schedule / အစီအစဉ် — MCF National Cycling Event 2026 (26–28 June)",
      },
      {
        name: "description",
        content:
          "Working Draft v1 day-by-day programme for the 2026 64th MCF National Cycling Event — Road Race 26 June, MTB XCO 27 June, Criterium and Awards 28 June. Final Team Version pending.",
      },
      {
        property: "og:title",
        content: "Schedule — MCF National Cycling Event 2026",
      },
      {
        property: "og:description",
        content:
          "Working Draft v1 day-by-day programme. Final Team Version pending.",
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
  type: "Points" | "Separate" | "Ceremony" | "Meeting" | "Exhibition" | "Transition";
  notes?: string;
};

const DAYS: Array<{
  date: string;
  my: string;
  heading: string;
  items: Item[];
}> = [
  {
    date: "26 June 2026",
    my: "ဇွန် ၂၆",
    heading: "Road Race — Hlegu 11 Hills Round ",
    items: [
      {
        time: "07:00",
        event: "Road Race",
        category: "Men Elite — 100 km",
        venue: "Hlegu 11 Hills Round  → Phukyi roundabout (out / back)",
        type: "Points",
      },
      {
        time: "07:00",
        event: "Road Race",
        category:
          "Men Junior — 100 km (paired start with Men Elite, separate classification)",
        venue: "Hlegu 11 Hills Round  → Phukyi roundabout (out / back)",
        type: "Points",
      },
      {
        time: "07:15",
        event: "Road Race",
        category: "Women Elite / Open — 60 km",
        venue: "Hlegu 11 Hills Round  → Milestone 14/1 (out / back)",
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
        time: "07:00",
        event: "MTB XCO",
        category: "Men Open",
        venue: "We Love Taikkyi → Mirror Mountains",
        type: "Separate",
      },
    ],
  },
  {
    date: "28 June 2026",
    my: "ဇွန် ၂၈",
    heading: "Thuwunna Criterium + Awards — Final Day Programme",
    items: [
      {
        time: "06:45–07:00",
        event: "Rider Sign-On / ပြိုင်ပွဲဝင် အမည်စာရင်းသွင်းခြင်း",
        category: "All categories · Junior first",
        venue: "Thuwunna outer ring",
        type: "Meeting",
        notes: "Mandatory; closes 15 min before each start. Bib + transponder check.",
      },
      {
        time: "07:00–07:30",
        event: "Junior Criterium / လူငယ်တန်း Criterium",
        category: "15 laps × 1.3 km",
        venue: "Thuwunna outer ring",
        type: "Points",
        notes: "Race 1",
      },
      {
        time: "07:30–07:40",
        event: "Transition / ပြိုင်ပွဲကြား ပြင်ဆင်ချိန်",
        category: "Women stage + sign-on",
        venue: "Thuwunna",
        type: "Transition",
      },
      {
        time: "07:40–08:15",
        event: "Women Criterium / အမျိုးသမီးတန်း Criterium",
        category: "15 laps × 1.3 km",
        venue: "Thuwunna outer ring",
        type: "Points",
        notes: "Race 2",
      },
      {
        time: "08:15–08:30",
        event: "BMX Team Demonstration / BMX သရုပ်ပြ",
        category: "Exhibition · 15 minutes",
        venue: "Thuwunna outer ring",
        type: "Exhibition",
        notes: "Crowd segment between races",
      },
      {
        time: "08:30–08:40",
        event: "Transition / ပြိုင်ပွဲကြား ပြင်ဆင်ချိန်",
        category: "Men Elite stage + sign-on",
        venue: "Thuwunna",
        type: "Transition",
      },
      {
        time: "08:40–09:15",
        event: "Men Elite Criterium — Final / အမျိုးသား Elite နောက်ဆုံးပြိုင်ပွဲ",
        category: "15 laps × 1.3 km",
        venue: "Thuwunna outer ring",
        type: "Points",
        notes: "Marquee race; confirm final lap count if changed.",
      },
      {
        time: "09:15–09:30",
        event: "Fixie Group Demonstration / Fixie သရုပ်ပြ",
        category: "Exhibition · 15 minutes",
        venue: "Thuwunna outer ring",
        type: "Exhibition",
      },
      {
        time: "09:30–09:45",
        event: "Open Criterium / Open တန်း Criterium",
        category: "5 laps × 1.3 km",
        venue: "Thuwunna outer ring",
        type: "Separate",
        notes: "Open participation race",
      },
      {
        time: "09:45–10:00",
        event: "Prepare Award Stage / ဆုချီးမြှင့်ပွဲ စင်ပြင်ဆင်ခြင်း",
        category: "Stage and podium setup",
        venue: "MCF compound · Thuwunna",
        type: "Transition",
      },
      {
        time: "10:00–10:40",
        event: "Award Ceremony / ဆုချီးမြှင့်ပွဲ အခမ်းအနား",
        category: "See award order below",
        venue: "MCF compound · Thuwunna",
        type: "Ceremony",
        notes: "Guest of Honour and Main Sponsor MSP / CAT",
      },
      {
        time: "10:40",
        event: "Close / ပွဲအစီအစဉ် ပြီးဆုံးခြင်း",
        category: "—",
        venue: "Thuwunna",
        type: "Meeting",
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
    case "Exhibition":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
    case "Transition":
      return "bg-muted/60 text-muted-foreground";
  }
}

function SchedulePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      
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
                    {it.notes ? (
                      <p className="mt-1.5 text-xs text-muted-foreground/90 italic">
                        {it.notes}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>

              {/* Desktop table */}
              <div className="hidden md:block mt-4 rounded-lg border border-border overflow-x-auto bg-card">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/60 text-left">
                    <tr>
                      <th className="px-3 py-2.5 font-semibold w-24">Time</th>
                      <th className="px-3 py-2.5 font-semibold">Event</th>
                      <th className="px-3 py-2.5 font-semibold">Category</th>
                      <th className="px-3 py-2.5 font-semibold">Venue</th>
                      <th className="px-3 py-2.5 font-semibold w-28">Type</th>
                      <th className="px-3 py-2.5 font-semibold">Notes</th>
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
                        <td className="px-3 py-2 text-xs text-muted-foreground">
                          {it.notes ?? ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {day.date === "28 June 2026" ? <Day3Extras /> : null}
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-md border border-border bg-muted/30 p-4 text-sm">
          <p>
            <span className="font-semibold">Reminder:</span> Times above reflect
            the current Working Draft. They may still be adjusted by MCF before
            the Final Team Version is released.
          </p>
          <p lang="my" className="mt-2 text-xs text-muted-foreground">
            အချိန်များသည် Working Draft အဆင့်ဖြစ်ပြီး MCF မှ Final Team Version
            ထုတ်ပြန်ပြီးမှသာ နောက်ဆုံးအတည်ပြုသွားမည်ဖြစ်ပါသည်။
          </p>
        </div>

        <p className="mt-6">
          <Link
            to="/guide"
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

const AWARD_ORDER: Array<{ en: string; mm: string }> = [
  { en: "Open Category — Top 10", mm: "Open တန်း အကောင်းဆုံး ၁၀ ဦး" },
  { en: "Junior — Gold / Silver / Bronze", mm: "လူငယ်တန်း ပထမဆု / ဒုတိယဆု / တတိယဆု" },
  { en: "Women — Gold / Silver / Bronze", mm: "အမျိုးသမီးတန်း ပထမဆု / ဒုတိယဆု / တတိယဆု" },
  { en: "Men Elite — Gold / Silver / Bronze", mm: "အမျိုးသား Elite တန်း ပထမဆု / ဒုတိယဆု / တတိယဆု" },
  { en: "Team Classification — Top 3", mm: "အသင်းလိုက် အကောင်းဆုံး ၃ သင်း" },
  { en: "Recognition — BMX Demonstration Team", mm: "BMX သရုပ်ပြအဖွဲ့အား ဂုဏ်ပြုခြင်း" },
  { en: "Recognition — Fixie Demonstration Team", mm: "Fixie သရုပ်ပြအဖွဲ့အား ဂုဏ်ပြုခြင်း" },
];

const SPECTATOR_NOTES_EN = [
  "Sign-on closes 15 minutes before each start.",
  "Times are based on a 1.3 km circuit and may be adjusted by officials.",
  "Award ceremony begins after the final Criterium and stage preparation.",
  "Spectators must follow marshals, police, and MCF officials.",
];

const SPECTATOR_NOTES_MM = [
  "ပြိုင်ပွဲဝင် အမည်စာရင်းသွင်းခြင်းကို ပြိုင်ပွဲစတင်ချိန်မတိုင်မီ ၁၅ မိနစ်အလိုတွင် ပိတ်ပါမည်။",
  "အချိန်ဇယားသည် ၁ ပတ်လျှင် ၁.၃ ကီလိုမီတာရှိသော Criterium လမ်းကြောင်းအပေါ် အခြေခံထားပြီး တာဝန်ရှိသူများမှ လိုအပ်သလို ပြင်ဆင်နိုင်ပါသည်။",
  "ဆုချီးမြှင့်ပွဲကို နောက်ဆုံး Criterium ပြိုင်ပွဲနှင့် စင်မြင့်ပြင်ဆင်မှုများပြီးနောက် စတင်ပါမည်။",
  "ပရိသတ်များသည် marshal များ၊ ရဲနှင့် MCF တာဝန်ရှိသူများ၏ ညွှန်ကြားချက်များကို လိုက်နာရမည်။",
];

function Day3Extras() {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-border bg-card p-5">
        <h3 className="font-semibold text-primary">
          Award Ceremony Order{" "}
          <span lang="my" className="text-sm text-muted-foreground">
            · ဆုချီးမြှင့်ပွဲ အစီအစဉ်
          </span>
        </h3>
        <ol className="mt-3 space-y-2 text-sm list-decimal list-inside">
          {AWARD_ORDER.map((a) => (
            <li key={a.en}>
              <span>{a.en}</span>
              <span lang="my" className="block pl-5 text-xs text-muted-foreground">
                {a.mm}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-md border border-border border-l-4 border-l-accent bg-accent/5 p-5 text-sm">
        <h3 className="font-semibold text-primary">
          Spectator Notes{" "}
          <span lang="my" className="text-sm text-muted-foreground">
            · ပရိသတ်များအတွက် မှတ်ချက်များ
          </span>
        </h3>
        <ul className="mt-3 space-y-1.5 list-disc list-inside">
          {SPECTATOR_NOTES_EN.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <ul lang="my" className="mt-3 space-y-1.5 list-disc list-inside text-xs text-muted-foreground">
          {SPECTATOR_NOTES_MM.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </div>
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
          Schedule — Working Draft v1. Final Team Version pending.
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
          — Final Team Version pending. /{" "}
          <span lang="my">
            ပထမအဆင့် မူကြမ်း — Final Team Version ထုတ်ပြန်ရန် ကျန်ပါသည်။
          </span>
        </span>
      </span>
    </div>
  );
}
