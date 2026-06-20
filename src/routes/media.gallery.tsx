import { createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon } from "lucide-react";
import { useLang, t } from "@/lib/i18n";

type Group = {
  id: string;
  title: { en: string; mm: string };
  date?: string;
  images: Array<{ url: string; alt: string }>;
};

const GROUPS: Group[] = [
  {
    id: "road-race",
    date: "26 June 2026",
    title: { en: "Road Race — Hlegu 11 Hills", mm: "လမ်းမပြိုင်ပွဲ — လှည်းကူး ၁၁ တောင်" },
    images: [],
  },
  {
    id: "mtb",
    date: "27 June 2026",
    title: { en: "MTB XCO — Taikkyi / Mirror Mountains", mm: "MTB XCO — တိုက်ကြီး / မှန်တောင်" },
    images: [],
  },
  {
    id: "criterium",
    date: "28 June 2026",
    title: { en: "Criterium + Awards — Thuwunna", mm: "ခရိုက်တီးရီယမ် နှင့် ဆုပေးပွဲ — သုဝဏ္ဏ" },
    images: [],
  },
  {
    id: "archive",
    title: { en: "Archive", mm: "မှတ်တမ်း" },
    images: [],
  },
];

export const Route = createFileRoute("/media/gallery")({
  head: () => ({
    meta: [{ title: "Gallery — MCF National Cycling Event 2026" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { lang } = useLang();
  return (
    <div className="space-y-10">
      {GROUPS.map((g) => (
        <section key={g.id}>
          <div className="mb-3 flex items-baseline gap-3">
            <h2 className="text-lg font-semibold text-foreground">{t(g.title, lang)}</h2>
            {g.date ? (
              <span className="font-mono text-xs text-muted-foreground">{g.date}</span>
            ) : null}
          </div>
          {g.images.length === 0 ? (
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
              <ImageIcon className="h-5 w-5 shrink-0" />
              <span>
                {lang === "mm"
                  ? "ဓာတ်ပုံများကို ပြိုင်ပွဲပြီးနောက် တင်ပါမည်။"
                  : "Photos will be uploaded after race day."}
              </span>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {g.images.map((img, i) => (
                <li key={i} className="overflow-hidden rounded-md border border-border">
                  <img
                    src={img.url}
                    alt={img.alt}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
