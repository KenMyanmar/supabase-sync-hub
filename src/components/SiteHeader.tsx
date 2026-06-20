import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Menu, Radio } from "lucide-react";
import mcfLogo from "@/assets/mcf-mcf-logo.png.asset.json";
import { useLang, t } from "@/lib/i18n";
import { NAV, MEDIA_SUBNAV, CTA } from "@/lib/strings";
import { LanguageToggle } from "@/components/LanguageToggle";
import { MobileNav } from "@/components/MobileNav";
import { useRegistrationOpen } from "@/lib/useRegistrationOpen";
import { useLivePill } from "@/lib/useLivePill";
import { cn } from "@/lib/utils";

const HIDE_ON: string[] = ["/register"];

export function SiteHeader() {
  const { lang } = useLang();
  const { loading: regLoading, open: regOpen } = useRegistrationOpen();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mediaOpen, setMediaOpen] = useState(false);


  if (HIDE_ON.some((p) => pathname.startsWith(p))) return null;

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/";
    return pathname === to || pathname.startsWith(to + "/");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:flex lg:justify-between">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <img
              src={mcfLogo.url}
              alt="MCF logo"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 object-contain"
            />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                MCF
              </span>
              <span className="truncate text-[11px] text-muted-foreground">
                National Cycling Event 2026
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV.map((n) => {
              if (n.to === "/media") {
                return (
                  <div
                    key={n.to}
                    className="relative"
                    onMouseEnter={() => setMediaOpen(true)}
                    onMouseLeave={() => setMediaOpen(false)}
                  >
                    <Link
                      to="/media"
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors",
                        isActive("/media")
                          ? "bg-muted font-semibold text-foreground"
                          : "text-foreground/80 hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {t(n, lang)}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Link>
                    {mediaOpen && (
                      <div className="absolute left-0 top-full z-50 min-w-[200px] rounded-md border border-border bg-popover py-1 text-popover-foreground shadow-lg">
                        {MEDIA_SUBNAV.map((m) => (
                          <Link
                            key={m.to}
                            to={m.to}
                            className="block px-3 py-2 text-sm hover:bg-muted"
                            onClick={() => setMediaOpen(false)}
                          >
                            {t(m, lang)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    isActive(n.to)
                      ? "bg-muted font-semibold text-foreground"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground",
                  )}
                >
                  {t(n, lang)}
                </Link>
              );
            })}
            {!regLoading && regOpen && (
              <Link
                to="/register"
                className="ml-2 inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
              >
                {t(CTA.register, lang)}
              </Link>
            )}
            <LanguageToggle className="ml-2" />

          </nav>

          {/* Mobile trigger */}
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
