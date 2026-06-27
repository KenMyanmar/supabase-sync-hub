import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";
import type { ResultRow, StandingRow } from "@/lib/site-content.functions";
import { PODIUM } from "@/components/ResultsTable";

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
