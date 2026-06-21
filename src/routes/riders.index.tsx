import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoResultsYet } from "@/components/NoResultsYet";

export const Route = createFileRoute("/riders/")({
  head: () => ({
    meta: [
      { title: "Teams & Riders — MCF National Cycling Event 2026" },
      {
        name: "description",
        content:
          "Confirmed teams and riders for the 2026 MCF National Cycling Event. 9 teams, 32 rider slots. Elite Men individual list with the official start list.",
      },
      { property: "og:title", content: "Teams & Riders — MCF National Cycling Event 2026" },
      {
        property: "og:description",
        content:
          "9 teams (32 riders) confirmed for team classification. Junior & Women pending final verification.",
      },
    ],
  }),
  component: RidersPage,
  notFoundComponent: () => <NoResultsYet />,
});

// Public copy only — no phone numbers, ages, DOB, NRC, or internal QA flags.
type TeamStatus = "confirmed" | "provisional";
type Team = {
  name: string;
  slots: number;
  status: TeamStatus;
  riders: string[];
  noteEn?: string;
  noteMm?: string;
};

const TEAMS: Team[] = [
  {
    name: "RCC",
    slots: 4,
    status: "confirmed",
    riders: ["Kaung Htet Linn", "Ye Myat Kyaw", "Pyae Sone", "Lu Htoo Han"],
  },
  {
    name: "FCC / Flamingo Cycling Club",
    slots: 4,
    status: "confirmed",
    riders: ["Wai Hlyan Aung", "Bhone Pyae Paing", "Aung Kyaw Hein", "AnttAwwAung"],
  },
  {
    name: "KNCC / Ko Naing Cycling Club",
    slots: 4,
    status: "confirmed",
    riders: ["Ko Thet Lwin Oo", "Htet Arkar Lwin", "Mg Than Myint Khing", "Saw Jimmy"],
  },
  {
    name: "TSCC",
    slots: 4,
    status: "provisional",
    riders: ["Htet Aung Soe", "Kyaw Za Ya Nyein", "Khant Min Htet", "Htein Linn"],
    noteEn: "Team name and one rider entry are in final verification.",
    noteMm: "အသင်းအမည်နှင့် ပြိုင်ပွဲဝင်တစ်ဦးကို နောက်ဆုံးစိစစ်ဆဲဖြစ်ပါသည်။",
  },
  {
    name: "STCC",
    slots: 3,
    status: "provisional",
    riders: ["U Saw Than", "Ko Maung Maung", "Nyi Nyi Aung"],
    noteEn: "Team name is in final verification.",
    noteMm: "အသင်းအမည်ကို နောက်ဆုံးစိစစ်ဆဲဖြစ်ပါသည်။",
  },
  {
    name: "Lightning",
    slots: 4,
    status: "provisional",
    riders: ["Jonathan / Khant Min Myat", "Saw Nay Kbaw Mue", "Saw Alex", "Mg Nang Win Htet"],
    noteEn: "Rider identities are confirmed; some roster details are in final verification.",
    noteMm:
      "ပြိုင်ပွဲဝင်များ၏ အမည်များ အတည်ဖြစ်ပြီး အချို့အသေးစိတ်ကို နောက်ဆုံးစိစစ်ဆဲဖြစ်ပါသည်။",
  },
  {
    name: "Triathlon",
    slots: 3,
    status: "confirmed",
    riders: ["Htay Ko Ko", "Kyaw Min Thein", "Aung Phyo Min"],
  },
  {
    name: "TDC / Team Delta Cycling",
    slots: 3,
    status: "provisional",
    riders: ["Paing Soe Oo", "Pyae Sone Thant", "Htet Hlaing Phyo"],
    noteEn: "Roster is in final verification.",
    noteMm: "အသင်းစာရင်းကို နောက်ဆုံးစိစစ်ဆဲဖြစ်ပါသည်။",
  },
  {
    name: "Duathlon",
    slots: 3,
    status: "provisional",
    riders: ["Kyaw Htet Aung", "Ko Lin Lin", "Aung Myint Swe"],
    noteEn: "Team name and one rider entry are in final verification.",
    noteMm: "အသင်းအမည်နှင့် ပြိုင်ပွဲဝင်တစ်ဦးကို နောက်ဆုံးစိစစ်ဆဲဖြစ်ပါသည်။",
  },
];

function RidersPage() {
  const { lang } = useLang();
  const mm = lang === "mm";

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          {mm ? "ပြိုင်ပွဲဝင်များ" : "Riders"} · MCF National Cycling Event 2026
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-primary">
          {mm ? "အသင်းများနှင့် ပြိုင်ပွဲဝင်များ" : "Teams & Riders"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {mm
            ? "MCF အတည်ပြုစာရင်း။ ဖုန်းနံပါတ်၊ အသက်နှင့် ကိုယ်ရေးအချက်အလက်များကို ဖော်ပြခြင်းမရှိပါ။"
            : "MCF confirmed summary. Phone numbers and personal details are not published."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/riders/watch"
            className="inline-flex items-center rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            {mm ? "စောင့်ကြည့်ထိုက်သူများ" : "Riders to Watch"} →
          </Link>
        </div>
      </header>

      <Tabs defaultValue="elite" className="mt-8">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="elite">{mm ? "အမျိုးသား Elite" : "Elite Men"}</TabsTrigger>
          <TabsTrigger value="team">{mm ? "အသင်းလိုက်" : "Team"}</TabsTrigger>
          <TabsTrigger value="junior">{mm ? "လူငယ်တန်း" : "Junior"}</TabsTrigger>
          <TabsTrigger value="women">{mm ? "အမျိုးသမီးတန်း" : "Women"}</TabsTrigger>
        </TabsList>

        <TabsContent value="elite" className="mt-6">
          <EliteMenCard mm={mm} />
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <TeamSection mm={mm} />
        </TabsContent>

        <TabsContent value="junior" className="mt-6">
          <PendingCard title={mm ? "လူငယ်တန်း" : "Junior"} mm={mm} />
        </TabsContent>

        <TabsContent value="women" className="mt-6">
          <PendingCard title={mm ? "အမျိုးသမီးတန်း" : "Women"} mm={mm} />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function StatusBadge({ status, mm }: { status: TeamStatus; mm: boolean }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
        {mm ? "အတည်ပြုပြီး" : "Confirmed"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
      {mm ? "ယာယီ" : "Provisional"}
    </span>
  );
}

const ELITE_MEN_RIDERS: Array<string | null> = [
  "Ko Aye Min Hlaing",
  "Kyaw Zin Latt",
  null,
  null,
  null,
  "Yair Man Aung",
  null,
  null,
  "Ko Min Thant Oo",
  "Han Htoo Sat",
  "Htun Lin Aung",
  null,
  null, // Team Taunggyi rider — name not locked
  null, // Team Taunggyi rider — name not locked
  "Mg Shine Nanda",
  null,
  null,
  "Thit Htoo Eain",
  "Aung Myat Ko Ko",
  "Mg Kaung Myat Khant",
  null,
  "Kaung Zaw Maung",
  "U Than Naing Soe",
  null,
  "Pyae Phyo Aung",
  "Mg Min Khant Ko",
  "Khant Zaw Thi Ha",
  "Khun Hein Htet Zan",
];

function EliteMenCard({ mm }: { mm: boolean }) {
  const confirmedCount = ELITE_MEN_RIDERS.filter((n) => !!n).length;
  const pendingCount = ELITE_MEN_RIDERS.length - confirmedCount;
  return (
    <article className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold text-primary">
          {mm ? "အမျိုးသား Elite — တစ်ဦးချင်း" : "Elite Men — Individual"}
        </h2>
        <StatusBadge status="confirmed" mm={mm} />
      </div>
      <p className="mt-3 text-base">
        {mm
          ? "အမျိုးသား Elite တန်းအတွက် ပြိုင်ပွဲဝင် ၂၈ ဦးကို MCF မှ အတည်ပြုပြီးပါသည်။"
          : "28 Elite Men individual riders confirmed by MCF."}
      </p>
      <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <Stat label={mm ? "Road Race Elite" : "Road Race Elite"} value="28" />
        <Stat label={mm ? "Criterium Elite" : "Criterium Elite"} value="28" />
        <Stat label={mm ? "တစ်ဦးချင်း Elite" : "Unique Elite"} value="28" />
        <Stat label={mm ? "ပြိုင်ပွဲ ဝင်ရောက်မှု" : "Event entries"} value="56" />
      </dl>

      <div className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {mm ? "ပြိုင်ပွဲဝင်စာရင်း" : "Rider List"}
          </h3>
          <span className="text-[11px] text-muted-foreground">
            {mm
              ? `အမည်ထုတ်ပြန် ${confirmedCount} · အတည်ပြုဆဲ ${pendingCount}`
              : `${confirmedCount} named · ${pendingCount} pending`}
          </span>
        </div>
        <ol className="mt-3 grid gap-1.5 sm:grid-cols-2 text-sm">
          {ELITE_MEN_RIDERS.map((name, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="w-6 shrink-0 text-muted-foreground tabular-nums">{idx + 1}.</span>
              {name ? (
                <span>{name}</span>
              ) : (
                <span className="italic text-muted-foreground">
                  {mm ? "အမည် အတည်ပြုဆဲ" : "Name pending confirmation"}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {mm
          ? "တရားဝင် Start List ထုတ်ပြန်ချိန်တွင် ပြိုင်ပွဲဝင်အမည်များကို နောက်ဆုံးအတည်ပြုဖော်ပြမည်။"
          : "Names will be finalized when the official start list is published."}
      </p>
    </article>
  );
}

function TeamSection({ mm }: { mm: boolean }) {
  return (
    <div className="space-y-5">
      <article className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl font-bold text-primary">
            {mm ? "အသင်းလိုက် ပြိုင်ပွဲ" : "Team Classification"}
          </h2>
          <StatusBadge status="confirmed" mm={mm} />
        </div>
        <p className="mt-3 text-base">
          {mm
            ? "အသင်းလိုက်ပြိုင်ပွဲအတွက် အသင်း ၉ သင်းနှင့် ပြိုင်ပွဲဝင်နေရာ ၃၂ ခု အတည်ပြုပြီးပါသည်။"
            : "9 teams and 32 rider slots are confirmed for the team classification."}
        </p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm max-w-xs">
          <Stat label={mm ? "အသင်းများ" : "Teams"} value="9" />
          <Stat label={mm ? "ပြိုင်ပွဲဝင်" : "Rider slots"} value="32" />
        </dl>
        <div className="mt-4 rounded-md border-l-4 border-l-accent bg-accent/5 px-4 py-3 text-sm">
          <p>
            {mm
              ? "အသင်းများတွင် Junior ပြိုင်ပွဲဝင်များ ပါဝင်နိုင်ပြီး ခွင့်ပြုထားပါသည်။ အချို့အသင်းစာရင်းအသေးစိတ်များကို နောက်ဆုံးစိစစ်ဆဲဖြစ်ပါသည်။"
              : "Teams may include junior riders, which is permitted. Some roster details remain provisional until final verification."}
          </p>
        </div>
      </article>

      <div className="grid gap-4 sm:grid-cols-2">
        {TEAMS.map((tm, i) => (
          <TeamCard key={tm.name} team={tm} index={i + 1} mm={mm} />
        ))}
      </div>
    </div>
  );
}

function TeamCard({ team, index, mm }: { team: Team; index: number; mm: boolean }) {
  const isConfirmed = team.status === "confirmed";
  const borderClass = isConfirmed
    ? "border-emerald-500/30 bg-emerald-500/5"
    : "border-amber-500/30 bg-amber-500/5";
  const note = mm ? team.noteMm : team.noteEn;

  return (
    <article className={`rounded-lg border ${borderClass} p-4 sm:p-5 shadow-sm`}>
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {mm ? `အသင်း ${index}` : `Team ${index}`}
          </p>
          <h3 className="mt-0.5 text-base font-bold text-primary">{team.name}</h3>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={team.status} mm={mm} />
          <span className="text-[11px] text-muted-foreground">
            {team.slots} {mm ? "နေရာ" : team.slots === 1 ? "slot" : "slots"}
          </span>
        </div>
      </header>
      <ol className="mt-3 space-y-1 text-sm">
        {team.riders.map((r, idx) => (
          <li key={`${team.name}-${idx}`} className="flex gap-2">
            <span className="w-5 shrink-0 text-muted-foreground tabular-nums">{idx + 1}.</span>
            <span>{r}</span>
          </li>
        ))}
      </ol>
      {note ? (
        <p className="mt-3 rounded-md border-l-2 border-l-amber-500/60 bg-amber-500/5 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
          {note}
        </p>
      ) : null}
    </article>
  );
}

function PendingCard({ title, mm }: { title: string; mm: boolean }) {
  return (
    <article className="rounded-lg border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {mm ? "ဆိုင်းငံ့ထား" : "Pending"}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {mm ? "စာရင်းအတည်ပြုနေဆဲဖြစ်ပါသည်။" : "Final list pending confirmation."}
      </p>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-card px-3 py-2">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-lg font-bold text-primary">{value}</div>
    </div>
  );
}
