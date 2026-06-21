import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useLang } from "@/lib/i18n";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NoResultsYet } from "@/components/NoResultsYet";
import { getPublicRiders, type PublicRider } from "@/lib/public-riders.functions";

const publicRidersQO = queryOptions({
  queryKey: ["public-riders"],
  queryFn: () => getPublicRiders(),
});

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
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(publicRidersQO);
  },
  component: RidersPage,
  errorComponent: ({ error }) => (
    <p className="mx-auto max-w-3xl px-4 py-10 text-sm text-destructive">{error.message}</p>
  ),
  notFoundComponent: () => <NoResultsYet />,
});

type TeamStatus = "confirmed" | "provisional";

type Rider = { name: string; reg: string; provisional?: boolean };

type Team = {
  name: string;
  status: TeamStatus;
  riders: Rider[];
};

// Team rosters remain hardcoded: the team→rider mapping is not modeled in the DB yet.
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

function displayName(r: PublicRider, mm: boolean): string {
  const primary = mm ? r.name_my || r.name_en : r.name_en || r.name_my;
  return (primary ?? "").trim() || r.registration_no;
}

function toRider(r: PublicRider, mm: boolean, provisional = false): Rider {
  return { name: displayName(r, mm), reg: r.registration_no, provisional };
}

function sortByName(rs: Rider[]): Rider[] {
  return [...rs].sort((a, b) => a.name.localeCompare(b.name));
}

function RidersPage() {
  const { lang } = useLang();
  const mm = lang === "mm";
  const { data } = useSuspenseQuery(publicRidersQO);

  const derived = useMemo(() => {
    const eliteRoad = data.filter(
      (r) => r.category === "Men Elite" && r.in_road && r.in_crit,
    );
    const juniorRoad = data.filter(
      (r) => r.category === "Men Junior" && r.in_road && r.in_crit,
    );
    const womenRoad = data.filter(
      (r) => r.category === "Women" && r.in_road && r.in_crit,
    );
    const mtb = data.filter((r) => r.in_mtb);
    const tbc = data.filter(
      (r) => r.category === "Uncategorized" && r.in_road && r.in_crit,
    );

    return {
      eliteConfirmed: sortByName(
        eliteRoad.filter((r) => r.status === "confirmed").map((r) => toRider(r, mm)),
      ),
      eliteProvisional: sortByName(
        eliteRoad
          .filter((r) => r.status === "provisional")
          .map((r) => toRider(r, mm, true)),
      ),
      juniorConfirmed: sortByName(
        juniorRoad.filter((r) => r.status === "confirmed").map((r) => toRider(r, mm)),
      ),
      juniorProvisional: sortByName(
        juniorRoad
          .filter((r) => r.status === "provisional")
          .map((r) => toRider(r, mm, true)),
      ),
      women: sortByName(womenRoad.map((r) => toRider(r, mm))),
      mtbMen: sortByName(
        mtb.filter((r) => r.category !== "Women").map((r) => toRider(r, mm)),
      ),
      mtbWomen: sortByName(
        mtb.filter((r) => r.category === "Women").map((r) => toRider(r, mm)),
      ),
      categoryToConfirm: sortByName(tbc.map((r) => toRider(r, mm))),
    };

  }, [data, mm]);

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

      <Tabs defaultValue="team" className="mt-8">
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="team">{mm ? "အသင်းလိုက်" : "Team"}</TabsTrigger>
          <TabsTrigger value="elite">{mm ? "အမျိုးသား Elite" : "Men Elite"}</TabsTrigger>
          <TabsTrigger value="women">{mm ? "အမျိုးသမီးတန်း" : "Women"}</TabsTrigger>
          <TabsTrigger value="junior">{mm ? "လူငယ်တန်း" : "Junior"}</TabsTrigger>
          <TabsTrigger value="mtb">MTB XCO</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="mt-6">
          <TeamSection mm={mm} />
        </TabsContent>

        <TabsContent value="elite" className="mt-6">
          <EliteMenCard
            mm={mm}
            confirmed={derived.eliteConfirmed}
            provisional={derived.eliteProvisional}
          />
        </TabsContent>

        <TabsContent value="women" className="mt-6">
          <SimpleRosterCard
            mm={mm}
            title={mm ? "အမျိုးသမီးတန်း" : "Women"}
            status="confirmed"
            riders={derived.women}
          />
        </TabsContent>

        <TabsContent value="junior" className="mt-6">
          <JuniorCard
            mm={mm}
            confirmed={derived.juniorConfirmed}
            provisional={derived.juniorProvisional}
          />
        </TabsContent>

        <TabsContent value="mtb" className="mt-6">
          <MTBCard mm={mm} men={derived.mtbMen} women={derived.mtbWomen} />
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
  if (riders.length === 0) {
    return (
      <p className="mt-3 text-sm text-muted-foreground">
        {mm ? "စာရင်း မရှိသေးပါ။" : "No riders yet."}
      </p>
    );
  }
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

function EliteMenCard({
  mm,
  confirmed,
  provisional,
}: {
  mm: boolean;
  confirmed: Rider[];
  provisional: Rider[];
}) {
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
          ? `အမျိုးသား Elite တစ်ဦးချင်း — အသက်အရွယ်အတည်ပြုပြီး ${confirmed.length} ဦး၊ အသက်စိစစ်ဆဲ ${provisional.length} ဦး။`
          : `Men Elite individual — ${confirmed.length} age-confirmed, ${provisional.length} pending age verification.`}
      </p>
      <RegClarifier mm={mm} />

      <section className="mt-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {mm ? `အတည်ပြုပြီး (${confirmed.length})` : `Confirmed (${confirmed.length})`}
        </h3>
        <RiderList riders={confirmed} mm={mm} />
      </section>

      {provisional.length > 0 ? (
        <section className="mt-6">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {mm
                ? `အသက်စိစစ်ဆဲ (${provisional.length})`
                : `Pending age verification (${provisional.length})`}
            </h3>
            <StatusBadge status="provisional" mm={mm} />
          </div>
          <RiderList riders={provisional} mm={mm} />
        </section>
      ) : null}

      <p className="mt-5 text-xs text-muted-foreground">
        {mm
          ? "မှတ်ချက် — အသင်းစာရင်းပါ ပြိုင်ပွဲဝင်များသည် အမျိုးသား Elite တစ်ဦးချင်းတွင်လည်း ပြိုင်ဆိုင်ပါသည်။"
          : "Note: Riders on the team rosters also compete in Men Elite individual."}
      </p>
    </article>
  );
}

function JuniorCard({
  mm,
  confirmed,
  provisional,
}: {
  mm: boolean;
  confirmed: Rider[];
  provisional: Rider[];
}) {
  return (
    <article className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold text-primary">
          {mm ? "လူငယ်တန်း (Junior)" : "Junior"}
        </h2>
        <StatusBadge status="confirmed" mm={mm} />
      </div>
      <p className="mt-3 text-base">
        {mm
          ? `လူငယ်တန်း (Junior) — အတည်ပြုပြီး ${confirmed.length} ဦး၊ စိစစ်ဆဲ ${provisional.length} ဦး။`
          : `Junior — ${confirmed.length} confirmed, ${provisional.length} pending verification.`}
      </p>
      <RegClarifier mm={mm} />

      <section className="mt-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {mm ? `အတည်ပြုပြီး (${confirmed.length})` : `Confirmed (${confirmed.length})`}
        </h3>
        <RiderList riders={confirmed} mm={mm} />
      </section>

      {provisional.length > 0 ? (
        <section className="mt-6">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              {mm ? `စိစစ်ဆဲ (${provisional.length})` : `Pending verification (${provisional.length})`}
            </h3>
            <StatusBadge status="provisional" mm={mm} />
          </div>
          <RiderList riders={provisional} mm={mm} />
        </section>
      ) : null}

      <p className="mt-4 rounded-md border-l-2 border-l-amber-500/60 bg-amber-500/5 px-3 py-2 text-xs text-amber-800 dark:text-amber-300">
        {mm
          ? "အသက်အရွယ်သတ်မှတ်ချက်နှင့် အချက်အလက်များကို နောက်ဆုံးအတည်ပြုဆဲဖြစ်ပါသည်။"
          : "Age eligibility and details are being finalized for these riders."}
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
            ? `အသင်းလိုက်ပြိုင်ပွဲအတွက် အသင်း ${TEAMS.length} သင်း အတည်ပြုပြီးပါသည်။`
            : `${TEAMS.length} teams are confirmed for the team classification.`}
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
}: {
  mm: boolean;
  title: string;
  status: TeamStatus;
  riders: Rider[];
}) {
  const isConfirmed = status === "confirmed";
  const borderClass = isConfirmed
    ? "border-emerald-500/30 bg-emerald-500/5"
    : "border-amber-500/30 bg-amber-500/5";

  return (
    <article className={`rounded-lg border ${borderClass} p-5 sm:p-6 shadow-sm`}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold text-primary">
          {title} ({riders.length})
        </h2>
        <StatusBadge status={status} mm={mm} />
      </div>
      <RegClarifier mm={mm} />
      <RiderList riders={riders} mm={mm} />
    </article>
  );
}

function NeutralBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {label}
    </span>
  );
}

function MTBCard({ mm, men, women }: { mm: boolean; men: Rider[]; women: Rider[] }) {
  const total = men.length + women.length;
  return (
    <article className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold text-primary">MTB XCO</h2>
        <NeutralBadge label={mm ? "လူတိုင်းပါဝင်နိုင်" : "Open"} />
      </div>
      <p className="mt-3 text-base">
        {mm
          ? `MTB XCO — လူတိုင်းပါဝင်နိုင် · စာရင်းသွင်းပြီး ${total} ဦး။`
          : `MTB XCO — open participation · ${total} registered riders.`}
      </p>
      <RegClarifier mm={mm} />

      <section className="mt-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {mm ? `အမျိုးသား (${men.length})` : `Men (${men.length})`}
        </h3>
        <RiderList riders={men} mm={mm} />
      </section>

      <section className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          {mm ? `အမျိုးသမီး (${women.length})` : `Women (${women.length})`}
        </h3>
        <RiderList riders={women} mm={mm} />
      </section>
    </article>
  );
}
