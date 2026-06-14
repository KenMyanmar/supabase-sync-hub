import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useLang, t } from "@/lib/i18n";
import { MEDIA_SUBNAV, SECTION } from "@/lib/strings";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/media")({
  head: () => ({
    meta: [
      { title: "Media Centre — MCF National Cycling Event 2026" },
      {
        name: "description",
        content:
          "News, press releases, gallery and media contact for the 2026 MCF National Cycling Event.",
      },
      { property: "og:title", content: "Media Centre — MCF National Cycling Event 2026" },
      {
        property: "og:description",
        content:
          "Official news, press releases and media resources for the 2026 MCF National Cycling Event.",
      },
    ],
  }),
  component: MediaLayout,
});

function MediaLayout() {
  const { lang } = useLang();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">
          {t(SECTION.media, lang)}
        </h1>
      </header>

      <nav className="mt-6 flex flex-wrap gap-1 border-b border-border">
        {MEDIA_SUBNAV.map((m) => {
          const active =
            m.to === "/media"
              ? pathname === "/media"
              : pathname === m.to || pathname.startsWith(m.to + "/");
          return (
            <Link
              key={m.to}
              to={m.to}
              className={cn(
                "rounded-t-md px-3 py-2 text-sm transition-colors",
                active
                  ? "border-b-2 border-primary font-semibold text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t(m, lang)}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6">
        <Outlet />
      </div>
    </main>
  );
}
