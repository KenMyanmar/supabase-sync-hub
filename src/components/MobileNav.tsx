import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useLang, t } from "@/lib/i18n";
import { MOBILE_NAV, MEDIA_SUBNAV, CTA } from "@/lib/strings";
import { LanguageToggle } from "@/components/LanguageToggle";

type Props = { open: boolean; onClose: () => void };

export function MobileNav({ open, onClose }: Props) {
  const { lang } = useLang();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-foreground/40 lg:hidden"
      onClick={onClose}
    >
      <div
        className="absolute right-0 top-0 flex h-full w-80 max-w-[88vw] flex-col bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <LanguageToggle />
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {/* Register first */}
          <Link
            to="/register"
            onClick={onClose}
            className="mb-4 inline-flex w-full items-center justify-center gap-1 rounded-md bg-accent px-3 py-3 text-sm font-semibold text-accent-foreground"
          >
            {t(CTA.register, lang)}
          </Link>

          <nav className="flex flex-col">
            {MOBILE_NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={onClose}
                className="flex flex-col rounded-md px-3 py-2.5 hover:bg-muted"
              >
                <span className="text-sm font-medium text-foreground">
                  {n.en}
                </span>
                <span lang="my" className="text-xs text-muted-foreground">
                  {n.mm}
                </span>
              </Link>
            ))}

            {/* Media sub-nav */}
            <div className="mt-1 ml-3 border-l border-border pl-3">
              {MEDIA_SUBNAV.slice(1).map((m) => (
                <Link
                  key={m.to}
                  to={m.to}
                  onClick={onClose}
                  className="flex flex-col rounded-md px-3 py-2 hover:bg-muted"
                >
                  <span className="text-xs text-foreground/80">{m.en}</span>
                  <span lang="my" className="text-[11px] text-muted-foreground">
                    {m.mm}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
