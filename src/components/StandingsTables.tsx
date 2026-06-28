import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";
import type { ResultRow, StandingRow } from "@/lib/site-content.functions";
import { PODIUM } from "@/components/ResultsTable";

const CHAMPION_CATEGORY: Record<string, { en: string; mm: string }> = {
  MEN_ELITE: { en: "Men Elite", mm: "အမျိုးသား Elite" },
  WOMEN: { en: "Women Elite", mm: "အမျိုးသမီး" },
  JUNIOR: { en: "Men Junior", mm: "လူငယ်" },
  TEAM: { en: "Team", mm: "အသင်း" },
};

export function ChampionsBanner({
  rows,
  lang,
}: {
  rows: StandingRow[];
  lang: Lang;
}) {
  const sorted = [...rows].sort(
    (a, b) => (a.position ?? 999) - (b.position ?? 999),
  );
  const titleLabel = lang === "mm" ? "အမျိုးသားချန်ပီယံ" : "National Champion";
  const name = (r: StandingRow) =>
    (lang === "mm" ? r.name_mm : r.name_en) || r.name_en || r.name_mm || "—";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {sorted.map((r) => {
        const cat = r.registration_no
          ? CHAMPION_CATEGORY[r.registration_no]
          : undefined;
        const catLabel = cat
          ? lang === "mm"
            ? cat.mm
            : cat.en
          : (r.registration_no ?? "");
        return (
          <div
            key={r.id}
            className={cn(
              "rounded-lg border-2 border-amber-400/70 bg-gradient-to-br from-amber-50 to-yellow-100/50 p-4 shadow-sm",
              "dark:from-amber-950/30 dark:to-yellow-900/20",
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/90 text-white shadow">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  {catLabel} · {titleLabel}
                </p>
                <p className="mt-1 text-lg font-bold text-foreground">
                  {name(r)}
                </p>
                {r.team_club ? (
                  <p className="text-sm text-muted-foreground">{r.team_club}</p>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}


function riderName(r: ResultRow, lang: Lang): string {
  return (
    (lang === "mm" ? r.name_mm : r.name_en) || r.name_en || r.name_mm || "—"
  );
}

export type PointsSection = { key: string; title: string; rows: ResultRow[] };

export function PointsStanding({
  sections,
  lang,
}: {
  sections: PointsSection[];
  lang: Lang;
}) {
  const unattached = lang === "mm" ? "လွတ်လပ်ပြိုင်" : "unattached";
  const scoring = sections
    .map((s) => ({
      ...s,
      rows: s.rows
        .filter((r) => r.points != null)
        .sort((a, b) => (b.points ?? 0) - (a.points ?? 0)),
    }))
    .filter((s) => s.rows.length > 0);

  if (scoring.length === 0) return null;

  return (
    <div className="space-y-8">
      {scoring.map((s) => (
        <section key={s.key}>
          <h2 className="mb-3 text-xl font-semibold">{s.title}</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[480px] text-sm">
              <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left w-14">Rank</th>
                  <th className="px-3 py-2 text-left">Rider</th>
                  <th className="px-3 py-2 text-left">Team / Club</th>
                  <th className="px-3 py-2 text-right w-20 tabular-nums">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {s.rows.map((r, i) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-3 py-2 font-semibold tabular-nums">
                      {i + 1}
                    </td>
                    <td className="px-3 py-2 font-medium text-foreground">
                      {riderName(r, lang)}
                    </td>
                    <td className="px-3 py-2">
                      {r.team_club ? (
                        r.team_club
                      ) : (
                        <em className="text-muted-foreground">{unattached}</em>
                      )}
                    </td>
                    <td className="px-3 py-2 text-right font-bold tabular-nums">
                      {r.points ?? 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

export function TeamStandingTable({ rows }: { rows: StandingRow[]; lang: Lang }) {
  const sorted = [...rows].sort(
    (a, b) => (a.position ?? 999) - (b.position ?? 999),
  );
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[420px] text-sm">
        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left w-16">Rank</th>
            <th className="px-3 py-2 text-left">Team</th>
            <th className="px-3 py-2 text-right w-20 tabular-nums">Points</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const pos = r.position ?? 0;
            const podium = PODIUM[pos];
            return (
              <tr
                key={r.id}
                className={cn("border-t border-border", podium?.tint)}
              >
                <td className="px-3 py-2 font-semibold tabular-nums">
                  {podium ? `${podium.medal} ` : ""}
                  {r.position ?? "—"}
                </td>
                <td className="px-3 py-2 font-medium text-foreground">
                  {r.name_en ?? "—"}
                </td>
                <td className="px-3 py-2 text-right font-bold tabular-nums">
                  {r.points_or_time_ms ?? 0}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function MedalTable({ rows, lang }: { rows: StandingRow[]; lang: Lang }) {
  const sorted = [...rows].sort(
    (a, b) => (a.position ?? 999) - (b.position ?? 999),
  );
  const isUnranked = (r: StandingRow) =>
    (r.position ?? 999) >= 99 || r.name_en === "Unattached / Independent";
  const ranked = sorted.filter((r) => !isUnranked(r));
  const unranked = sorted.filter(isUnranked);
  const caption =
    lang === "mm"
      ? "ယာယီ — ပြိုင်ပွဲများပြီးတိုင်း မွမ်းမံပါမည်။"
      : "Provisional — updated as events finish.";
  const outsideLabel =
    lang === "mm" ? "ကလပ်အဆင့်သတ်မှတ်မှု ပြင်ပ" : "outside club ranking";

  const total = (r: StandingRow) =>
    r.points_or_time_ms ?? (r.gold ?? 0) + (r.silver ?? 0) + (r.bronze ?? 0);

  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">{caption}</p>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[520px] text-sm">
          <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left w-16">Rank</th>
              <th className="px-3 py-2 text-left">Team</th>
              <th className="px-3 py-2 text-center w-14">🥇</th>
              <th className="px-3 py-2 text-center w-14">🥈</th>
              <th className="px-3 py-2 text-center w-14">🥉</th>
              <th className="px-3 py-2 text-right w-20 tabular-nums">Total</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r) => {
              const pos = r.position ?? 0;
              const podium = PODIUM[pos];
              return (
                <tr
                  key={r.id}
                  className={cn("border-t border-border", podium?.tint)}
                >
                  <td className="px-3 py-2 font-semibold tabular-nums">
                    {podium ? `${podium.medal} ` : ""}
                    {r.position ?? "—"}
                  </td>
                  <td className="px-3 py-2 font-medium text-foreground">
                    {r.name_en ?? "—"}
                  </td>
                  <td className="px-3 py-2 text-center tabular-nums">
                    {r.gold ?? 0}
                  </td>
                  <td className="px-3 py-2 text-center tabular-nums">
                    {r.silver ?? 0}
                  </td>
                  <td className="px-3 py-2 text-center tabular-nums">
                    {r.bronze ?? 0}
                  </td>
                  <td className="px-3 py-2 text-right font-bold tabular-nums">
                    {total(r)}
                  </td>
                </tr>
              );
            })}
            {unranked.map((r) => (
              <tr
                key={r.id}
                className="border-t border-border text-muted-foreground"
              >
                <td className="px-3 py-2 tabular-nums">—</td>
                <td className="px-3 py-2">
                  <span className="font-medium">{r.name_en ?? "—"}</span>
                  <span className="ml-2 text-xs italic">({outsideLabel})</span>
                </td>
                <td className="px-3 py-2 text-center tabular-nums">
                  {r.gold ?? 0}
                </td>
                <td className="px-3 py-2 text-center tabular-nums">
                  {r.silver ?? 0}
                </td>
                <td className="px-3 py-2 text-center tabular-nums">
                  {r.bronze ?? 0}
                </td>
                <td className="px-3 py-2 text-right font-bold tabular-nums">
                  {total(r)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
