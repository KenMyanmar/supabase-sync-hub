import { createFileRoute, Link } from "@tanstack/react-router";
import { useLang, t } from "@/lib/i18n";
import { SECTION } from "@/lib/strings";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners & Organisers — MCF National Cycling Event 2026" },
      {
        name: "description",
        content:
          "Organising committee, technical officials, government partners and sponsors of the 2026 MCF National Cycling Event.",
      },
      { property: "og:title", content: "Partners — MCF National Cycling Event 2026" },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const { lang } = useLang();
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
      <header className="max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-primary">
          {t(SECTION.partners, lang)}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {lang === "mm"
            ? "စည်းရုံးရေးကော်မတီ၊ နည်းပညာအရာရှိများနှင့် မိတ်ဖက်များ"
            : "Organising committee, technical officials, government partners and sponsors."}
        </p>
      </header>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-border p-5">
          <h2 className="font-semibold text-foreground">
            {lang === "mm" ? "စည်းရုံးရေး" : "Organisers"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Myanmar Cycling Federation (MCF) ·{" "}
            <span lang="my">မြန်မာနိုင်ငံ စက်ဘီးအဖွဲ့ချုပ်</span>
          </p>
          <Link to="/" hash="organisers" className="mt-3 inline-block text-sm text-primary underline">
            {lang === "mm" ? "အသေးစိတ်ကြည့်ရန်" : "View details"} →
          </Link>
        </section>
        <section className="rounded-lg border border-border p-5">
          <h2 className="font-semibold text-foreground">
            {lang === "mm" ? "ပံ့ပိုးသူများ" : "Sponsors"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {lang === "mm"
              ? "၂၀၂၆ ပြိုင်ပွဲ၏ တရားဝင် ပံ့ပိုးသူများ။"
              : "Official supporters of the 2026 National Cycling Event."}
          </p>
          <Link to="/" hash="sponsors" className="mt-3 inline-block text-sm text-primary underline">
            {lang === "mm" ? "ပံ့ပိုးသူများ ကြည့်ရန်" : "View sponsors"} →
          </Link>
        </section>
      </div>
    </main>
  );
}
