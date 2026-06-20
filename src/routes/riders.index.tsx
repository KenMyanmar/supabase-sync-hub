import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { listConfirmedRiders } from "@/lib/site-content.functions";
import { useLang, t } from "@/lib/i18n";
import { SECTION, EMPTY, CTA } from "@/lib/strings";
import { NoResultsYet } from "@/components/NoResultsYet";

const ridersQO = queryOptions({
  queryKey: ["site", "confirmed-riders"],
  queryFn: () => listConfirmedRiders(),
});

export const Route = createFileRoute("/riders/")({
  head: () => ({
    meta: [
      { title: "Teams & Riders — MCF National Cycling Event 2026" },
      {
        name: "description",
        content:
          "Registration status, confirmed teams and riders for the 2026 MCF National Cycling Event.",
      },
      { property: "og:title", content: "Teams & Riders — MCF National Cycling Event 2026" },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(ridersQO);
  },
  component: RidersPage,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm text-destructive">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => <NoResultsYet />,
});

function RidersPage() {
  const { lang } = useLang();
  const riders = useSuspenseQuery(ridersQO).data;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">
          {t(SECTION.riders, lang)}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {lang === "mm"
            ? "စာရင်းသွင်းမှု အခြေအနေနှင့် အတည်ပြုပြီး အသင်း / ပြိုင်ပွဲဝင်များ"
            : "Registration status, confirmed teams and riders."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            to="/riders/watch"
            className="inline-flex items-center rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            {lang === "mm" ? "စောင့်ကြည့်ထိုက်သူများ" : "Riders to Watch"}
          </Link>
          <Link
            to="/"
            hash="status"
            className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted"
          >
            {t(CTA.checkStatus, lang)}
          </Link>
        </div>
      </header>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {lang === "mm" ? "အတည်ပြုပြီး ပြိုင်ပွဲဝင်များ" : "Confirmed Riders"}
        </h2>
        {riders.length === 0 ? (
          <NoResultsYet message={EMPTY.noRiders} />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Reg. No</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Team / Club</th>
                  <th className="px-3 py-2">Events</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {riders.map((r) => (
                  <tr key={r.registration_no}>
                    <td className="px-3 py-2 font-mono text-xs">{r.registration_no}</td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{r.english_name ?? "—"}</div>
                      {r.name ? (
                        <div lang="my" className="text-xs text-muted-foreground">{r.name}</div>
                      ) : null}
                    </td>
                    <td className="px-3 py-2">{r.team_club ?? "—"}</td>
                    <td className="px-3 py-2 text-xs">
                      {(r.events ?? []).join(", ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
