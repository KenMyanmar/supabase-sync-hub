import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: "sm" | "md";
};

export function LanguageToggle({ className, size = "sm" }: Props) {
  const { lang, setLang } = useLang();
  const base =
    size === "sm"
      ? "px-2.5 py-1 text-xs"
      : "px-3 py-1.5 text-sm";
  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background/80 p-0.5 shadow-sm",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={cn(
          "rounded-full font-semibold transition-colors",
          base,
          lang === "en"
            ? "bg-primary text-primary-foreground"
            : "text-foreground/70 hover:text-foreground",
        )}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("mm")}
        aria-pressed={lang === "mm"}
        lang="my"
        className={cn(
          "rounded-full font-semibold transition-colors",
          base,
          lang === "mm"
            ? "bg-primary text-primary-foreground"
            : "text-foreground/70 hover:text-foreground",
        )}
      >
        မြန်မာ
      </button>
    </div>
  );
}
