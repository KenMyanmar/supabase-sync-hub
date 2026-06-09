import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { lookupRegistration, type PublicRegistration } from "@/lib/registrations.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "မှတ်ပုံတင်လက်ခံပြီး စာရင်း — MCF" },
      {
        name: "description",
        content:
          "Myanmar Cycling Federation — Registration Received List. Search and filter cyclists who have submitted their registration.",
      },
      { property: "og:title", content: "မှတ်ပုံတင်လက်ခံပြီး စာရင်း — MCF" },
      {
        property: "og:description",
        content:
          "Registration Received List. Final Start List will be announced by MCF after eligibility checks.",
      },
    ],
  }),
  component: PublicList,
});

const EVENTS = ["all", "Road Race", "Criterium", "MTB XCO"];
const STATUSES = [
  "all",
  "Registration received - pending MCF verification",
  "Pending",
  "Needs correction",
  "Duplicate / under review",
  "Confirmed for provisional start list",
];

const STATUS_LABEL: Record<string, string> = {
  all: "အားလုံး / All statuses",
  "Registration received - pending MCF verification":
    "လက်ခံပြီး — MCF စိစစ်ဆဲ",
  Pending: "စောင့်ဆိုင်းဆဲ",
  "Needs correction": "ပြင်ဆင်ရန် လိုအပ်",
  "Duplicate / under review": "ထပ်နေသည် / ပြန်စစ်ဆဲ",
  "Confirmed for provisional start list": "ယာယီ Start List အတည်ပြုပြီး",
};

const EVENT_LABEL: Record<string, string> = {
  all: "အားလုံး / All events",
  "Road Race": "Road Race",
  Criterium: "Criterium",
  "MTB XCO": "MTB XCO",
};

function statusBadgeClass(status: string | null): string {
  if (!status) return "bg-muted text-muted-foreground";
  if (status.startsWith("Confirmed")) return "bg-primary/15 text-primary";
  if (status === "Needs correction" || status.startsWith("Duplicate"))
    return "bg-destructive/15 text-destructive";
  return "bg-muted text-muted-foreground";
}

function PublicList() {
  const lookup = useServerFn(lookupRegistration);
  const [query, setQuery] = useState("");
  const [event, setEvent] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isFetching } = useQuery({
    queryKey: ["registrations", { query, event, status, page }],
    queryFn: () => lookup({ data: { query, event, status, page } }),
    placeholderData: keepPreviousData,
  });

  const rows: PublicRegistration[] = data?.rows ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 50;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-6">
          <p className="text-xs sm:text-sm text-muted-foreground tracking-wide">
            <span lang="my">မြန်မာနိုင်ငံ စက်ဘီးအဖွဲ့ချုပ်</span>
            <span className="mx-2">·</span>
            Myanmar Cycling Federation
          </p>
          <h1
            lang="my"
            className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight break-words max-w-full"
          >
            မှတ်ပုံတင်လက်ခံပြီး စာရင်း
          </h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Registration Received List
          </p>
        </header>

        {/* Official notice */}
        <aside
          className="mb-6 rounded-md border border-border border-l-4 border-l-primary bg-muted/40 p-4 text-sm leading-relaxed"
          role="note"
        >
          <p lang="my">
            ဤစာရင်းသည် Registration Received List သာ ဖြစ်ပါသည်။ Final Start List
            မဟုတ်သေးပါ။ Final Start List ကို MCF မှ category, age, event, MCF/UCI
            ID နှင့် eligibility စိစစ်ပြီးနောက် ထပ်မံကြေညာပေးသွားမည်ဖြစ်ပါသည်။
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            This is the Registration Received List only — not the Final Start List.
            MCF will publish the Final Start List after verifying category, age,
            event, MCF/UCI ID and eligibility.
          </p>
        </aside>

        {/* Filters */}
        <section className="mb-4 grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
          <div>
            <label htmlFor="q" className="block text-xs font-medium mb-1">
              <span lang="my">ရှာဖွေရန်</span>{" "}
              <span className="text-muted-foreground">/ Search</span>
            </label>
            <input
              id="q"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="အမည် / English name / team / reg no / phone"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              aria-label="Search registrations"
            />
          </div>
          <div>
            <label htmlFor="ev" className="block text-xs font-medium mb-1">
              <span lang="my">ပြိုင်ပွဲ</span>{" "}
              <span className="text-muted-foreground">/ Event</span>
            </label>
            <select
              id="ev"
              value={event}
              onChange={(e) => {
                setEvent(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {EVENTS.map((e) => (
                <option key={e} value={e}>
                  {EVENT_LABEL[e] ?? e}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="st" className="block text-xs font-medium mb-1">
              <span lang="my">အခြေအနေ</span>{" "}
              <span className="text-muted-foreground">/ Status</span>
            </label>
            <select
              id="st"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s] ?? s}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {rows.length === 0 && !isFetching && (
            <div className="rounded-md border border-border p-6 text-center text-sm text-muted-foreground">
              <span lang="my">မှတ်ပုံတင်စာရင်း မတွေ့ပါ။</span>
              <div className="mt-1">No registrations found.</div>
            </div>
          )}
          {rows.map((r) => (
            <article
              key={r.registration_no}
              className="rounded-md border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {r.registration_no}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[11px] font-medium ${statusBadgeClass(r.status)}`}
                >
                  {r.status ?? "—"}
                </span>
              </div>
              <div className="mt-2 text-base font-semibold" lang="my">
                {r.name ?? "—"}
              </div>
              {r.english_name && (
                <div className="text-sm text-muted-foreground">{r.english_name}</div>
              )}
              <div className="mt-2 text-sm">
                <span className="text-muted-foreground">Team / Club: </span>
                {r.team_club ?? "—"}
              </div>
              {r.events && r.events.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {r.events.map((ev) => (
                    <span
                      key={ev}
                      className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px]"
                    >
                      {ev}
                    </span>
                  ))}
                </div>
              )}
              {r.admin_remark && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {r.admin_remark}
                </div>
              )}
            </article>
          ))}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block rounded-md border border-border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-left sticky top-0">
              <tr>
                <th className="px-3 py-2 font-medium">Reg No</th>
                <th className="px-3 py-2 font-medium">
                  <span lang="my">အမည်</span> / Name
                </th>
                <th className="px-3 py-2 font-medium">English Name</th>
                <th className="px-3 py-2 font-medium">Team / Club</th>
                <th className="px-3 py-2 font-medium">Events</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Remark</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !isFetching && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-8 text-center text-muted-foreground"
                  >
                    <span lang="my">မှတ်ပုံတင်စာရင်း မတွေ့ပါ။</span> No
                    registrations found.
                  </td>
                </tr>
              )}
              {rows.map((r, i) => (
                <tr
                  key={r.registration_no}
                  className={`border-t border-border ${i % 2 ? "bg-muted/20" : ""}`}
                >
                  <td className="px-3 py-2 font-mono text-xs">
                    {r.registration_no}
                  </td>
                  <td className="px-3 py-2" lang="my">
                    {r.name ?? "—"}
                  </td>
                  <td className="px-3 py-2">{r.english_name ?? "—"}</td>
                  <td className="px-3 py-2">{r.team_club ?? "—"}</td>
                  <td className="px-3 py-2">
                    {r.events && r.events.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {r.events.map((ev) => (
                          <span
                            key={ev}
                            className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px]"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded px-2 py-0.5 text-[11px] font-medium ${statusBadgeClass(r.status)}`}
                    >
                      {r.status ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {r.admin_remark ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <footer className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            {isFetching ? (
              <span lang="my">ဖွင့်နေသည်…</span>
            ) : (
              <>
                <span lang="my">စုစုပေါင်း</span> {total}{" "}
                <span className="text-muted-foreground">
                  result{total === 1 ? "" : "s"}
                </span>
              </>
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-input px-3 py-1 disabled:opacity-50"
            >
              <span lang="my">ရှေ့</span>
              <span className="ml-1 text-muted-foreground">Prev</span>
            </button>
            <span>
              <span lang="my">စာမျက်နှာ</span> {page} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-input px-3 py-1 disabled:opacity-50"
            >
              <span lang="my">နောက်</span>
              <span className="ml-1 text-muted-foreground">Next</span>
            </button>
          </div>
        </footer>

        <div className="mt-10 border-t border-border pt-4 text-xs text-muted-foreground text-center">
          © Myanmar Cycling Federation
        </div>
      </div>
    </main>
  );
}
