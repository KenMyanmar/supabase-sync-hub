// Bilingual EN | MM context. Persisted to localStorage.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "mm";
const STORAGE_KEY = "mcf.lang";

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  // Hydrate from localStorage on mount (SSR-safe)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "mm") setLangState(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === "en" ? "mm" : "en");
  }, [lang, setLang]);

  return (
    <LangContext.Provider value={{ lang, setLang, toggle }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LangContext);
  if (!ctx) {
    // Soft fallback for components rendered outside provider (e.g. error page)
    return {
      lang: "en",
      setLang: () => {},
      toggle: () => {},
    };
  }
  return ctx;
}

/** Pick the right side of a bilingual pair. Falls back to EN when MM empty. */
export function t(pair: { en: string; mm: string }, lang: Lang): string {
  if (lang === "mm" && pair.mm) return pair.mm;
  return pair.en;
}

/** Pick `<field>_en` / `<field>_mm` off a row. Falls back to EN when MM empty. */
export function pick<T extends Record<string, unknown>>(
  row: T | null | undefined,
  field: string,
  lang: Lang,
): string {
  if (!row) return "";
  const en = (row[`${field}_en`] as string | null | undefined) ?? "";
  const mm = (row[`${field}_mm`] as string | null | undefined) ?? "";
  if (lang === "mm" && mm) return mm;
  return en;
}
