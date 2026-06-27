import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";
import type { ResultRow } from "@/lib/site-content.functions";

type Props = { rows: ResultRow[]; lang: Lang };

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function formatTime(ms: number | null | undefined): string | null {
  if (ms == null || !Number.isFinite(ms)) return null;
  const totalCs = Math.round(ms / 10); // hundredths
  const cs = totalCs % 100;
  const totalSeconds = Math.floor(totalCs / 100);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  return `${h}:${pad2(m)}:${pad2(s)}.${pad2(cs)}`;
}

export function formatGap(
  ms: number | null | undefined,
  position: number | null,
): string {
  if (position === 1) return "—";
  if (ms == null || !Number.isFinite(ms) || ms <= 0) return "—";
  const totalCs = Math.round(ms / 10);
  const cs = totalCs % 100;
  const totalSeconds = Math.floor(totalCs / 100);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  if (h > 0) return `+${h}:${pad2(m)}:${pad2(s)}.${pad2(cs)}`;
  return `+${m}:${pad2(s)}.${pad2(cs)}`;
}

export const PODIUM: Record<number, { tint: string; medal: string }> = {
  1: { tint: "bg-amber-50 dark:bg-amber-950/30", medal: "🥇" },
  2: { tint: "bg-slate-100 dark:bg-slate-800/40", medal: "🥈" },
  3: { tint: "bg-orange-50 dark:bg-orange-950/30", medal: "🥉" },
};

export function ResultsTable({ rows, lang }: Props) {
  const unattached = lang === "mm" ? "လွတ်လပ်ပြိုင်" : "unattached";
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left w-14">Pos</th>
            <th className="px-3 py-2 text-left w-14">BIB</th>
            <th className="px-3 py-2 text-left">Rider</th>
            <th className="px-3 py-2 text-left">Team / Club</th>
            <th className="px-3 py-2 text-right tabular-nums">Time</th>
            <th className="px-3 py-2 text-right tabular-nums">Gap</th>
            <th className="px-3 py-2 text-right w-14">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const pos = r.position ?? 0;
            const podium = PODIUM[pos];
            const name =
              (lang === "mm" ? r.name_mm : r.name_en) ||
              r.name_en ||
              r.name_mm ||
              "—";
            const time = formatTime(r.time_ms);
            const timeDisplay =
              time ?? (r.status ? r.status.toUpperCase() : "—");
            const isStatus = time == null;
            return (
              <tr
                key={r.id}
                className={cn(
                  "border-t border-border",
                  podium?.tint,
                  isStatus && "text-muted-foreground",
                )}
              >
                <td className="px-3 py-2 font-semibold tabular-nums">
                  {podium ? `${podium.medal} ` : ""}
                  {r.position ?? "—"}
                </td>
                <td className="px-3 py-2 tabular-nums">{r.bib ?? "—"}</td>
                <td className="px-3 py-2 font-medium text-foreground">
                  {name}
                </td>
                <td className="px-3 py-2">
                  {r.team_club ? (
                    r.team_club
                  ) : (
                    <em className="text-muted-foreground">{unattached}</em>
                  )}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {timeDisplay}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {isStatus ? "—" : formatGap(r.gap_ms, r.position)}
                </td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {r.points ?? "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
