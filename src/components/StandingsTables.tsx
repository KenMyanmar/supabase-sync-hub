import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lang } from "@/lib/i18n";
import type { ResultRow, StandingRow } from "@/lib/site-content.functions";
import { PODIUM } from "@/components/ResultsTable";
import menEliteAsset from "@/assets/champion-men-elite.jpg.asset.json";
import womenAsset from "@/assets/champion-women.jpg.asset.json";
import juniorAsset from "@/assets/champion-junior.jpg.asset.json";
import teamAsset from "@/assets/champion-team.jpg.asset.json";

const CHAMPION_CATEGORY: Record<
  string,
  { en: string; mm: string; photo: string; objectPosition?: string }
> = {
  MEN_ELITE: {
    en: "Men Elite",
    mm: "အမျိုးသား Elite",
    photo: menEliteAsset.url,
    objectPosition: "center 30%",
  },
  WOMEN: {
    en: "Women Elite",
    mm: "အမျိုးသမီး Elite",
    photo: womenAsset.url,
    objectPosition: "center 25%",
  },
  JUNIOR: {
    en: "Men Junior",
    mm: "လူငယ်",
    photo: juniorAsset.url,
    objectPosition: "center 30%",
  },
  TEAM: {
    en: "Team Champion",
    mm: "အသင်းချန်ပီယံ",
    photo: teamAsset.url,
    objectPosition: "center 35%",
  },
};

const CATEGORY_ORDER = ["MEN_ELITE", "WOMEN", "JUNIOR", "TEAM"];

export function ChampionsBanner({
  rows,
  lang,
}: {
  rows: StandingRow[];
  lang: Lang;
}) {
  const sorted = [...rows].sort((a, b) => {
    const ai = CATEGORY_ORDER.indexOf(a.registration_no ?? "");
    const bi = CATEGORY_ORDER.indexOf(b.registration_no ?? "");
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });
  const titleLabel =
    lang === "mm" ? "အမျိုးသားချန်ပီယံ" : "National Champion";
  const eyebrow =
    lang === "mm"
      ? "မြန်မာစက်ဘီးချန်ပီယံရှစ်ပြိုင်ပွဲ ၂၀၂၆"
      : "MCF National Cycling Championship 2026";
  const name = (r: StandingRow) =>
    (lang === "mm" ? r.name_mm : r.name_en) || r.name_en || r.name_mm || "—";

  return (
    <section className="relative">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
            {eyebrow}
          </p>
          <h2 className="mt-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
            {lang === "mm" ? "ချန်ပီယံများ" : "Champions"}
          </h2>
        </div>
        <div className="hidden h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent sm:block" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
            <article
              key={r.id}
              className={cn(
                "group relative overflow-hidden rounded-2xl",
                "ring-1 ring-amber-400/40 dark:ring-amber-300/30",
                "shadow-[0_8px_30px_-12px_rgba(180,120,20,0.45)]",
                "transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_18px_45px_-15px_rgba(180,120,20,0.6)]",
              )}
            >
              {/* gold border glow */}
              <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl ring-1 ring-inset ring-amber-200/30" />

              {/* photo */}
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                {cat?.photo ? (
                  <img
                    src={cat.photo}
                    alt={`${catLabel} — ${name(r)}`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    style={{ objectPosition: cat.objectPosition ?? "center" }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-200 to-yellow-400" />
                )}

                {/* dark gradient for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

                {/* gold accent strip top */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600" />

                {/* trophy badge */}
                <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-yellow-600 text-white shadow-lg ring-2 ring-white/40">
                  <Trophy className="h-5 w-5" />
                </div>

                {/* text overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
                    {titleLabel}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wider text-white/80">
                    {catLabel}
                  </p>
                  <h3 className="mt-1 text-lg font-bold leading-tight drop-shadow-sm">
                    {name(r)}
                  </h3>
                  {r.team_club ? (
                    <p className="mt-1 inline-block rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                      {r.team_club}
                    </p>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
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
