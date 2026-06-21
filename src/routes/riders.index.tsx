import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
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
          "Confirmed Elite Men individual entries and team classification for the 2026 MCF National Cycling Event. Junior and Women lists pending.",
      },
      { property: "og:title", content: "Teams & Riders — MCF National Cycling Event 2026" },
      {
        property: "og:description",
        content:
          "28 Elite Men individual riders and 9 teams (32 riders) confirmed. Junior & Women pending final verification.",
      },
    ],
  }),
  component: RidersPage,
  notFoundComponent: () => <NoResultsYet />,
});

// Privacy: never expose phone numbers, ages, or internal QA flags.
const SHOW_PROVISIONAL_RIDERS = false;
const SHOW_PROVISIONAL_TEAMS = false;

type TeamRow = { name: string; slots: number; status: "confirmed" | "pending"; pendingNote?: string };
const TEAMS: TeamRow[] = [
  { name: "RCC", slots: 4, status: "confirmed" },
  { name: "FCC (Flamingo)", slots: 4, status: "confirmed" },
  { name: "KNCC (Ko Naing)", slots: 4, status: "confirmed" },
  { name: "TSCC", slots: 4, status: "pending", pendingNote: "riders registered under KNCC" },
  { name: "STCC", slots: 3, status: "pending", pendingNote: "riders registered under KNCC" },
  { name: "Lightning", slots: 4, status: "confirmed" },
  { name: "Triathlon", slots: 3, status: "confirmed" },
  { name: "TDC (Team Delta)", slots: 3, status: "confirmed" },
  { name: "Duathlon", slots: 3, status: "pending", pendingNote: "riders registered under Triathlon" },
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
          {mm ? "အတည်ပြုပြီး ပြိုင်ပွဲဝင်များ" : "Confirmed Riders & Teams"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {mm
            ? "MCF ၏ အတည်ပြုချက်အရ အကျဉ်းချုပ်ဖော်ပြထားသော စာရင်းဖြစ်ပြီး၊ Database မှ အပြည့်အစုံ စိစစ်ပြီးသော start list မဟုတ်ပါ။"
            : "MCF confirmation summary — not a DB-verified start list. Names of individual riders are not published here for privacy."}
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
          <TeamCard mm={mm} />
        </TabsContent>

        <TabsContent value="junior" className="mt-6">
          <PendingCard
            title={mm ? "လူငယ်တန်း" : "Junior"}
            mm={mm}
          />
        </TabsContent>

        <TabsContent value="women" className="mt-6">
          <PendingCard
            title={mm ? "အမျိုးသမီးတန်း" : "Women"}
            mm={mm}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}

function ConfirmedBadge({ mm }: { mm: boolean }) {
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
      {mm ? "အတည်ပြုပြီး" : "Confirmed"}
    </span>
  );
}

function ProvisionalBadge({ mm }: { mm: boolean }) {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
      {mm ? "ယာယီ" : "Provisional"}
    </span>
  );
}

function EliteMenCard({ mm }: { mm: boolean }) {
  return (
    <article className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold text-primary">
          {mm ? "အမျိုးသား Elite — တစ်ဦးချင်း" : "Elite Men — Individual"}
        </h2>
        <ConfirmedBadge mm={mm} />
      </div>
      <p className="mt-3 text-base">
        {mm
          ? "အမျိုးသား Elite တန်းအတွက် ပြိုင်ပွဲဝင် ၂၈ ဦးကို MCF မှ အတည်ပြုပြီးပါသည်။"
          : "28 Elite Men individual riders confirmed by MCF."}
      </p>
      <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <Stat label={mm ? "စာရင်းပေး" : "Registered"} value="28" />
        <Stat label={mm ? "ပေးချေပြီး" : "Paid"} value="28" />
        <Stat label={mm ? "အတည်ပြုပြီး" : "Confirmed"} value="28" />
        <Stat label={mm ? "QA အမှတ်" : "QA score"} value="56" />
      </dl>
      <p className="mt-4 text-xs text-muted-foreground">
        {mm
          ? "ပြိုင်ပွဲဝင်တစ်ဦးချင်းအမည်များကို တရားဝင် start list ထွက်ပြီးမှ ထုတ်ပြန်ပါမည်။"
          : "Individual rider names will be published after the official start list is released."}
      </p>

      {SHOW_PROVISIONAL_RIDERS ? (
        <ProvisionalRiderToggle mm={mm} />
      ) : null}
    </article>
  );
}

function TeamCard({ mm }: { mm: boolean }) {
  const [showProvisional, setShowProvisional] = useState(false);
  const canToggle = SHOW_PROVISIONAL_TEAMS;

  return (
    <article className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xl font-bold text-primary">
          {mm ? "အသင်းလိုက် ပြိုင်ပွဲ" : "Team Classification"}
        </h2>
        <ConfirmedBadge mm={mm} />
      </div>
      <p className="mt-3 text-base">
        {mm
          ? "အသင်းလိုက်ပြိုင်ပွဲအတွက် အသင်း ၉ သင်း (ပြိုင်ပွဲဝင် ၃၂ ဦး) အတည်ပြုပြီးပါသည်။"
          : "9 teams (32 riders) confirmed for the team classification."}
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm max-w-xs">
        <Stat label={mm ? "အသင်းများ" : "Teams"} value="9" />
        <Stat label={mm ? "ပြိုင်ပွဲဝင်" : "Rider slots"} value="32" />
      </dl>

      <div className="mt-4 rounded-md border-l-4 border-l-accent bg-accent/5 px-4 py-3 text-sm">
        <p>
          {mm
            ? "အသင်းများတွင် အသက်အရွယ်ငယ် (Junior) ပြိုင်ပွဲဝင်များ ပါဝင်နိုင်ပြီး ၎င်းကို ခွင့်ပြုထားပါသည်။"
            : "Teams may include junior riders, which is permitted."}
        </p>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        {mm
          ? "အသင်းအလိုက် ပြိုင်ပွဲဝင်အမည်စာရင်းအပြည့်အစုံကို နောက်ဆုံးစိစစ်ပြီးမှ ထည့်သွင်းမည်ဖြစ်ပါသည်။"
          : "Full team rosters will be published after final verification."}
      </p>

      {canToggle ? (
        <div className="mt-5">
          <button
            type="button"
            onClick={() => setShowProvisional((v) => !v)}
            className="text-sm font-medium text-accent underline"
          >
            {showProvisional
              ? mm ? "ယာယီ အသင်းစာရင်း ဝှက်ထား" : "Hide provisional team list"
              : mm ? "ယာယီ အသင်းစာရင်း ပြရန်" : "Show provisional team list"}
          </button>
          {showProvisional ? <ProvisionalTeamList mm={mm} /> : null}
        </div>
      ) : null}
    </article>
  );
}

function ProvisionalTeamList({ mm }: { mm: boolean }) {
  return (
    <div className="mt-3">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <ProvisionalBadge mm={mm} />
        <p className="text-xs text-muted-foreground">
          {mm
            ? "ဤအသင်းအမည်အချို့ကို အတည်ပြုဆဲဖြစ်ပါသည်။"
            : "Some team names are still being confirmed."}
        </p>
      </div>
      <div className="overflow-x-auto rounded-md border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-3 py-2">{mm ? "အသင်း" : "Team"}</th>
              <th className="px-3 py-2 w-20">{mm ? "နေရာ" : "Slots"}</th>
              <th className="px-3 py-2">{mm ? "အခြေအနေ" : "Label status"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {TEAMS.map((tm) => (
              <tr key={tm.name}>
                <td className="px-3 py-2 font-medium">{tm.name}</td>
                <td className="px-3 py-2">{tm.slots}</td>
                <td className="px-3 py-2 text-xs">
                  {tm.status === "confirmed" ? (
                    <span className="text-emerald-700 dark:text-emerald-400">
                      {mm ? "အတည်ပြုပြီး" : "confirmed"}
                    </span>
                  ) : (
                    <span className="italic text-amber-700 dark:text-amber-400">
                      {mm ? "ယာယီ" : "pending"}
                      {tm.pendingNote ? ` — ${tm.pendingNote}` : ""}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProvisionalRiderToggle({ mm }: { mm: boolean }) {
  // Placeholder for v3 provisional rider list toggle. No rider names exposed here.
  return (
    <p className="mt-4 text-xs text-muted-foreground">
      {mm ? "ယာယီ စာရင်း ပိတ်ထားသည်။" : "Provisional list hidden."}
    </p>
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
