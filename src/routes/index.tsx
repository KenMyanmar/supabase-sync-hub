import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { lookupRegistration } from "@/lib/registrations.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Registration Received List" },
      {
        name: "description",
        content:
          "Public registration received list. Search and filter cyclists registered for the event.",
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
  "Duplicate / under review",
  "Confirmed for provisional start list",
];

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

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const pageSize = data?.pageSize ?? 50;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Registration Received List</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Showing entries received. Use search and filters to find a rider, team, or registration
            number.
          </p>
        </header>

        <aside
          className="mb-6 rounded-md border border-border bg-muted/40 p-4 text-sm leading-relaxed"
          lang="my"
        >
          ဤစာရင်းသည် Registration Received List သာ ဖြစ်ပါသည်။ Final Start List
          မဟုတ်သေးပါ။ Final Start List ကို MCF မှ category, age, event, MCF/UCI ID
          နှင့် eligibility စိစစ်ပြီးနောက် ထပ်မံကြေညာပေးသွားမည်ဖြစ်ပါသည်။
        </aside>

        <section className="mb-4 flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[220px]">
            <label className="block text-xs font-medium mb-1">Search</label>
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Name, English name, team, reg no, or phone digits"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Event</label>
            <select
              value={event}
              onChange={(e) => {
                setEvent(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {EVENTS.map((e) => (
                <option key={e} value={e}>
                  {e === "all" ? "All events" : e}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "all" ? "All statuses" : s}
                </option>
              ))}
            </select>
          </div>
        </section>

        <div className="rounded-md border border-border overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2 font-medium">Reg No</th>
                <th className="px-3 py-2 font-medium">Name</th>
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
                  <td colSpan={7} className="px-3 py-8 text-center text-muted-foreground">
                    No registrations found.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.registration_no} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-xs">{r.registration_no}</td>
                  <td className="px-3 py-2">{r.name ?? "—"}</td>
                  <td className="px-3 py-2">{r.english_name ?? "—"}</td>
                  <td className="px-3 py-2">{r.team_club ?? "—"}</td>
                  <td className="px-3 py-2">{r.events?.join(", ") ?? "—"}</td>
                  <td className="px-3 py-2">{r.status ?? "—"}</td>
                  <td className="px-3 py-2">{r.admin_remark ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {isFetching ? "Loading…" : `${total} result${total === 1 ? "" : "s"}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-md border border-input px-3 py-1 disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-md border border-input px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
