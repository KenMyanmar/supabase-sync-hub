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
          "Confirmed teams and riders with registration numbers for the 2026 MCF National Cycling Event.",
      },
      { property: "og:title", content: "Teams & Riders — MCF National Cycling Event 2026" },
      {
        property: "og:description",
        content:
          "Men Elite, Team, Junior and Women rosters with registration numbers. Race bib numbers assigned later.",
      },
    ],
  }),
  component: RidersPage,
  notFoundComponent: () => <NoResultsYet />,
});

type TeamStatus = "confirmed" | "provisional";

type Rider = { name: string; reg: string; provisional?: boolean };

type Team = {
  name: string;
  status: TeamStatus;
  riders: Rider[];
  noteEn?: string;
  noteMm?: string;
};

const MEN_ELITE_CONFIRMED: Rider[] = [
  { name: "Aung Kyaw Hein", reg: "NC26-0137" },
  { name: "Aung Myint Myat", reg: "NC26-0126" },
  { name: "Aung Myint Swe", reg: "NC26-0208" },
  { name: "Aung Phyo Min", reg: "NC26-0204" },
  { name: "Htay Ko Ko", reg: "NC26-0206" },
  { name: "Htein Linn", reg: "NC26-0008", provisional: true },
  { name: "Htet Arkar Lwin", reg: "NC26-0182" },
  { name: "Htet Aung Soe", reg: "NC26-0099" },
  { name: "Htet Hlaing Phyo", reg: "NC26-0225" },
  { name: "Htet Kyaw Thu", reg: "NC26-0002" },
  { name: "Kaung Htet Linn", reg: "NC26-0007" },
  { name: "Kaung Zaw Maung", reg: "NC26-0083" },
  { name: "Khant Zaw Thi Ha", reg: "NC26-0231" },
  { name: "Khun Hein Htet Zan", reg: "NC26-0188" },
  { name: "Khun Kham Htoo Paing", reg: "NC26-0023" },
  { name: "Ko Maung Maung", reg: "NC26-0202" },
  { name: "Ko Thet Lwin Oo", reg: "NC26-0203" },
  { name: "Kyaw Htet Aung", reg: "NC26-0205" },
  { name: "Kyaw Min Thein", reg: "NC26-0207" },
  { name: "Kyaw Za Ya Nyein", reg: "NC26-0114" },
  { name: "Kyaw Zin Latt", reg: "NC26-0001" },
  { name: "Lu Htoo Han", reg: "NC26-0011" },
  { name: "Mg Min Khant Ko", reg: "NC26-0245" },
  { name: "Mg Nang Win Htet", reg: "NC26-0235" },
  { name: "Min Min", reg: "NC26-0070" },
  { name: "Nyi Nyi Aung", reg: "NC26-0210" },
  { name: "Paing Soe Oo", reg: "NC26-0212" },
  { name: "Pyae Phyo Aung", reg: "NC26-0057" },
  { name: "Pyae Sone Thant", reg: "NC26-0223" },
  { name: "Saw Alex", reg: "NC26-0240", provisional: true },
  { name: "Saw Jimmy", reg: "NC26-0019" },
  { name: "Saw Nay Kbaw Mue", reg: "NC26-0191" },
  { name: "Si Thu Khant Min", reg: "NC26-0074" },
  { name: "Thi Ha Aung", reg: "NC26-0037" },
  { name: "Thura Aung", reg: "NC26-0033" },
  { name: "U Saw Than", reg: "NC26-0201" },
  { name: "Wai Hlyan Aung", reg: "NC26-0048" },
  { name: "Yair Man Aung", reg: "NC26-0079" },
  { name: "Ye Myat Kyaw", reg: "NC26-0102" },
];

const MEN_ELITE_PENDING: Rider[] = [
  { name: "Aung Myat Ko Ko", reg: "NC26-0045" },
  { name: "Bhone Pyae Sone Thant", reg: "NC26-0003" },
  { name: "Htun Lin Aung", reg: "NC26-0155" },
  { name: "Ko Aye Min Hlaing", reg: "NC26-0006" },
  { name: "Ko Min Thant Oo", reg: "NC26-0128" },
  { name: "Mg Aung Thiha Phyo", reg: "NC26-0021" },
  { name: "Mg Kaung Myat Khant", reg: "NC26-0024" },
  { name: "Mg Shine Nanda", reg: "NC26-0027" },
  { name: "Mg Than Myint Khing", reg: "NC26-0163" },
  { name: "Mg Wai Yan Min Zaw", reg: "NC26-0026" },
  { name: "Pyae Sone", reg: "NC26-0103" },
  { name: "Thit Htoo Eain", reg: "NC26-0040" },
  { name: "U Nay Moe", reg: "NC26-0148" },
  { name: "U Than Naing Soe", reg: "NC26-0149" },
  { name: "Wai Lin Maung", reg: "NC26-0084" },
];

const TEAMS: Team[] = [
  {
    name: "RCC",
    status: "confirmed",
    riders: [
      { name: "Kaung Htet Linn", reg: "NC26-0007" },
      { name: "Ye Myat Kyaw", reg: "NC26-0102" },
      { name: "Pyae Sone", reg: "NC26-0103" },
      { name: "Lu Htoo Han", reg: "NC26-0011" },
    ],
  },
  {
    name: "FCC / Flamingo Cycling Club",
    status: "confirmed",
    riders: [
      { name: "Wai Hlyan Aung", reg: "NC26-0048" },
      { name: "Bhone Pyae Paing", reg: "NC26-0131" },
      { name: "Aung Kyaw Hein", reg: "NC26-0137" },
      { name: "AnttAwwAung", reg: "NC26-0143" },
    ],
  },
  {
    name: "KNCC / Ko Naing Cycling Club",
    status: "confirmed",
    riders: [
      { name: "Ko Thet Lwin Oo", reg: "NC26-0203" },
      { name: "Htet Arkar Lwin", reg: "NC26-0182" },
      { name: "Mg Than Myint Khing", reg: "NC26-0163" },
      { name: "Saw Jimmy", reg: "NC26-0019" },
    ],
  },
  {
    name: "TSCC",
    status: "provisional",
    riders: [
      { name: "Htet Aung Soe", reg: "NC26-0099" },
      { name: "Kyaw Za Ya Nyein", reg: "NC26-0114" },
      { name: "Khant Min Htet", reg: "NC26-0211" },
      { name: "Htein Linn", reg: "NC26-0008" },
    ],
  },
  {
    name: "STCC",
    status: "provisional",
    riders: [
      { name: "U Saw Than", reg: "NC26-0201" },
      { name: "Ko Maung Maung", reg: "NC26-0202" },
      { name: "Nyi Nyi Aung", reg: "NC26-0210" },
    ],
  },
  {
    name: "Lightning",
    status: "provisional",
    riders: [
      { name: "Jonathan / Khant Min Myat", reg: "NC26-0176" },
      { name: "Saw Nay Kbaw Mue", reg: "NC26-0191" },
      { name: "Saw Alex", reg: "NC26-0240" },
      { name: "Mg Nang Win Htet", reg: "NC26-0235" },
    ],
  },
  {
    name: "Triathlon",
    status: "confirmed",
    riders: [
      { name: "Htay Ko Ko", reg: "NC26-0206" },
      { name: "Kyaw Min Thein", reg: "NC26-0207" },
      { name: "Aung Phyo Min", reg: "NC26-0204" },
    ],
  },
  {
    name: "TDC / Team Delta Cycling",
    status: "provisional",
    riders: [
      { name: "Paing Soe Oo", reg: "NC26-0212" },
      { name: "Pyae Sone Thant", reg: "NC26-0223" },
      { name: "Htet Hlaing Phyo", reg: "NC26-0225" },
    ],
  },
  {
    name: "Duathlon",
    status: "provisional",
    riders: [
      { name: "Kyaw Htet Aung", reg: "NC26-0205" },
      { name: "Ko Lin Lin", reg: "NC26-0209" },
      { name: "Aung Myint Swe", reg: "NC26-0208" },
    ],
  },
];

const JUNIOR_CONFIRMED: Rider[] = [
  { name: "Ye Yint Bo", reg: "NC26-0051" },
  { name: "Ye Swan Htet", reg: "NC26-0059" },
  { name: "Htet Wai Yan Kyaw", reg: "NC26-0061" },
  { name: "Min Kaung Myat", reg: "NC26-0075" },
  { name: "Hein Htet Aung", reg: "NC26-0068" },
  { name: "Kyaw Phyo Khant", reg: "NC26-0123" },
  { name: "Lin Htet", reg: "NC26-0142" },
  { name: "Sai Thiha", reg: "NC26-0055" },
  { name: "Thaw Tar Swe", reg: "NC26-0106" },
  { name: "Myat Min Htut", reg: "NC26-0010" },
  { name: "Sai Bhone Myat Han", reg: "NC26-0053" },
  { name: "Thuya Linn", reg: "NC26-0050" },
  { name: "Aung Ko Hein", reg: "NC26-0132" },
  { name: "Zay Yar Lin", reg: "NC26-0115" },
  { name: "Phone Thaw Khant", reg: "NC26-0175" },
  { name: "Aung Khant Hein", reg: "NC26-0181" },
  { name: "Si Thu Aung", reg: "NC26-0183" },
  { name: "Win Min Tun", reg: "NC26-0117" },
  { name: "Min Thurain Htun", reg: "NC26-0091" },
  { name: "Khant Zay Ya", reg: "NC26-0086" },
  { name: "Mg Thet Wai Lin", reg: "NC26-0177" },
  { name: "Zin Lin Phyo", reg: "NC26-0238" },
  { name: "Pyae Pyo Aung", reg: "NC26-0237" },
  { name: "Kaung Myat Thu", reg: "NC26-0230" },
  { name: "Mg Sein Thanlyin", reg: "NC26-0229" },
  { name: "Bhone Thiha Naung", reg: "NC26-0184" },
  { name: "Mg Shine Wai Yan", reg: "NC26-0244" },
  { name: "Mg Hein Htet San", reg: "NC26-0198" },
  { name: "Aung Khant Nyar Paing", reg: "NC26-0185" },
  { name: "Ye Lin Naing", reg: "NC26-0020" },
  { name: "Zaw Min Myat (Milo)", reg: "NC26-0169" },
  { name: "Myat Min Hein", reg: "NC26-0180" },
  { name: "Pyae Phyo Zaw", reg: "NC26-0224" },
];

const JUNIOR_PENDING: Rider[] = [
  { name: "Mg Kaung Thu Ta", reg: "NC26-0065" },
  { name: "Hpone Pyae Pai", reg: "NC26-0076" },
  { name: "Mg Hpone Myat Thet Tun", reg: "NC26-0082" },
  { name: "Sai Lyan Noom", reg: "NC26-0028" },
  { name: "Mg Htet Oo Wai Yan", reg: "NC26-0029" },
  { name: "Lin Wai Yan", reg: "NC26-0032" },
  { name: "Mg Thwin Htoo Zaw", reg: "NC26-0036" },
  { name: "Mg Htet Wai Aung", reg: "NC26-0105" },
  { name: "Kaung Nyein Thant", reg: "NC26-0161" },
  { name: "Paing Phoe Thu", reg: "NC26-0156" },
  { name: "Myat Taw Thar", reg: "NC26-0164" },
  { name: "Min Thu Khant", reg: "NC26-0127" },
  { name: "Mg Moe Myint Thu", reg: "NC26-0080" },
  { name: "Saw Min Thant Thu", reg: "NC26-0063" },
  { name: "Thet Paing Hein", reg: "NC26-0041" },
  { name: "Hein Tayza Aung", reg: "NC26-0174" },
  { name: "Kyal Lay", reg: "NC26-0243" },
  { name: "Pyae Phyo Thura", reg: "NC26-0241" },
  { name: "Sit Nanda", reg: "NC26-0214" },
  { name: "Thoon Nay Soe", reg: "NC26-0213" },
  { name: "Aung Hein Sat Paing", reg: "NC26-0216" },
  { name: "Kyal Sin Thwe", reg: "NC26-0250" },
  { name: "Han Min Htut", reg: "NC26-0035" },
];

const WOMEN_RIDERS: Rider[] = [
  { name: "Chaw Ei Ei Thu", reg: "NC26-0242" },
  { name: "Moe Pyae Pyae Kyaw", reg: "NC26-0179" },
  { name: "Nang Tharaphe Lin", reg: "NC26-0217" },
  { name: "Ko Lin Lin", reg: "NC26-0209" },
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
          <TabsTrigger value="elite">{mm ? "အမျိုးသား Elite" : "Men Elite"}</TabsTrigger>
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
          <JuniorCard mm={mm} />
        </TabsContent>


        <TabsContent value="women" className="mt-6">
          <SimpleRosterCard
            mm={mm}
            title={mm ? "အမျိုးသမီးတန်း" : "Women"}
            status="provisional"
            riders={WOMEN_RIDERS}
          />
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

function RegClarifier({ mm }: { mm: boolean }) {
  return (
    <p className="mt-3 text-xs text-muted-foreground">
      {mm
        ? "ပြသထားသော နံပါတ်များသည် စာရင်းသွင်းနံပါတ်ဖြစ်ပြီး၊ ပြိုင်ပွဲ bib နံပါတ်ကို နောက်မှ သတ်မှတ်ပါမည်။"
        : "Numbers shown are registration numbers; race bib numbers are assigned later."}
    </p>
  );
}

function RiderList({ riders, mm }: { riders: Rider[]; mm: boolean }) {
  return (
    <ol className="mt-3 grid gap-1.5 sm:grid-cols-2 text-sm">
      {riders.map((r, idx) => (
        <li key={r.reg} className="flex gap-2 items-baseline">
          <span className="w-6 shrink-0 text-muted-foreground tabular-nums">{idx + 1}.</span>
          <span className="flex-1">
            <span>{r.name}</span>
            <span className="text-muted-foreground"> — </span>
            <span className="font-mono text-xs tabular-nums">{r.reg}</span>
            {r.provisional ? (
              <span className="ml-2 inline-flex items-center rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400 align-middle">
                {mm ? "ယာယီ" : "Provisional"}
              </span>
            ) : null}
          </span>
        </li>
      ))}
    </ol>
  );
}

function EliteMenCard({ mm }: { mm: boolean }) {
  return (
    <article className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold text-primary">
          {mm ? "အမျိုးသား Elite — တစ်ဦးချင်း" : "Men Elite — Individual"}
        </h2>
        <StatusBadge status="confirmed" mm={mm} />
      </div>
      <p className="mt-3 text-base">
        {mm
          ? "အမျိုးသား Elite တစ်ဦးချင်း — အသက်အရွယ်အတည်ပြုပြီး ၃၉ ဦး၊ အသက်စိစစ်ဆဲ ၁၅ ဦး။"
          : "Men Elite individual — 39 age-confirmed, 15 pending age verification."}
      </p>
      <RegClarifier mm={mm} />

      <section className="mt-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {mm ? `အတည်ပြုပြီး (${MEN_ELITE_CONFIRMED.length})` : `Confirmed (${MEN_ELITE_CONFIRMED.length})`}
        </h3>
        <RiderList riders={MEN_ELITE_CONFIRMED} mm={mm} />
      </section>

      <section className="mt-6">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {mm
              ? `အသက်စိစစ်ဆဲ (${MEN_ELITE_PENDING.length})`
              : `Pending age verification (${MEN_ELITE_PENDING.length})`}
          </h3>
          <StatusBadge status="provisional" mm={mm} />
        </div>
        <RiderList riders={MEN_ELITE_PENDING} mm={mm} />
      </section>

      <p className="mt-5 text-xs text-muted-foreground">
        {mm
          ? "မှတ်ချက် — အသင်းစာရင်းပါ ပြိုင်ပွဲဝင်များသည် အမျိုးသား Elite တစ်ဦးချင်းတွင်လည်း ပြိုင်ဆိုင်ပါသည်။"
          : "Note: Riders on the team rosters also compete in Men Elite individual."}
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
            ? "အသင်းလိုက်ပြိုင်ပွဲအတွက် အသင်း ၉ သင်း အတည်ပြုပြီးပါသည်။"
            : "9 teams are confirmed for the team classification."}
        </p>
        <RegClarifier mm={mm} />
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
            {team.riders.length} {mm ? "နေရာ" : team.riders.length === 1 ? "slot" : "slots"}
          </span>
        </div>
      </header>
      <ol className="mt-3 space-y-1 text-sm">
        {team.riders.map((r, idx) => (
          <li key={r.reg} className="flex gap-2 items-baseline">
            <span className="w-5 shrink-0 text-muted-foreground tabular-nums">{idx + 1}.</span>
            <span className="flex-1">
              <span>{r.name}</span>
              <span className="text-muted-foreground"> — </span>
              <span className="font-mono text-xs tabular-nums">{r.reg}</span>
            </span>
          </li>
        ))}
      </ol>
    </article>
  );
}

function SimpleRosterCard({
  mm,
  title,
  status,
  riders,
  noteEn,
  noteMm,
}: {
  mm: boolean;
  title: string;
  status: TeamStatus;
  riders: Rider[];
  noteEn?: string;
  noteMm?: string;
}) {
  const isConfirmed = status === "confirmed";
  const borderClass = isConfirmed
    ? "border-emerald-500/30 bg-emerald-500/5"
    : "border-amber-500/30 bg-amber-500/5";
  const note = mm ? noteMm : noteEn;

  return (
    <article className={`rounded-lg border ${borderClass} p-5 sm:p-6 shadow-sm`}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold text-primary">{title}</h2>
        <StatusBadge status={status} mm={mm} />
      </div>
      <RegClarifier mm={mm} />
      <RiderList riders={riders} mm={mm} />
      {note ? (
        <p className="mt-4 rounded-md border-l-2 border-l-amber-500/60 bg-amber-500/5 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
          {note}
        </p>
      ) : null}
    </article>
  );
}
