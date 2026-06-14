import { Info } from "lucide-react";
import { useLang } from "@/lib/i18n";
import { EMPTY } from "@/lib/strings";

type Props = {
  message?: { en: string; mm: string };
  className?: string;
};

export function NoResultsYet({ message, className }: Props) {
  const { lang } = useLang();
  const m = message ?? EMPTY.commissairesPending;
  const text = lang === "mm" && m.mm ? m.mm : m.en;
  return (
    <div
      className={
        "rounded-lg border border-l-4 border-l-accent bg-accent/5 px-4 py-4 text-sm " +
        (className ?? "")
      }
    >
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <div>
          <p lang={lang === "mm" ? "my" : "en"} className="text-foreground/90">
            {text}
          </p>
          {lang === "en" && m.mm ? (
            <p lang="my" className="mt-2 text-xs text-muted-foreground">
              {m.mm}
            </p>
          ) : null}
          {lang === "mm" && m.en ? (
            <p className="mt-2 text-xs text-muted-foreground">{m.en}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
