import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Trophy, Store, Handshake } from "lucide-react";
import { useLang, t } from "@/lib/i18n";
import { SECTION } from "@/lib/strings";
import mspLogo from "@/assets/msp-cat-logo.jpg.asset.json";
import sportsGear from "@/assets/sports-gear-trading-logo.png.asset.json";
import easyGas from "@/assets/easy-gas-logo.png.asset.json";
import focuscore from "@/assets/focuscore-logo.jpg.asset.json";
import bbChicken from "@/assets/bb-chicken-collagen-broth.png.asset.json";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "Partners & Sponsors — MCF National Cycling Event 2026" },
      {
        name: "description",
        content:
          "Main sponsor, partner sponsors, champion bonus award, event village and partnership opportunities for the 2026 MCF National Cycling Event.",
      },
      { property: "og:title", content: "Partners — MCF National Cycling Event 2026" },
      { property: "og:url", content: "https://cyclings.live/partners" },
    ],
    links: [{ rel: "canonical", href: "https://cyclings.live/partners" }],
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
            ? "မိတ်ဖက်များ၊ ပံ့ပိုးသူများနှင့် ဆုပေးပံ့ပိုးမှုများ"
            : "Sponsors, partners and prize-bonus supporters of the 2026 National Cycling Championship."}
        </p>
      </header>

      {/* Main sponsor */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {lang === "mm" ? "အဓိက ပံ့ပိုးသူ" : "Main Sponsor"}
        </h2>
        <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-5">
          <img
            src={mspLogo.url}
            alt="MSP / CAT"
            className="h-20 w-auto object-contain"
            loading="lazy"
          />
          <div>
            <div className="text-lg font-semibold text-foreground">MSP / CAT</div>
            <p className="text-sm text-muted-foreground">
              {lang === "mm"
                ? "၂၀၂၆ အမျိုးသား စက်ဘီးပြိုင်ပွဲ၏ အဓိက ပံ့ပိုးသူ"
                : "Title sponsor of the 64th MCF National Cycling Championship 2026."}
            </p>
          </div>
        </div>
      </section>

      {/* Partner sponsors */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-foreground">
          {lang === "mm" ? "မိတ်ဖက် ပံ့ပိုးသူများ" : "Partner Sponsors"}
        </h2>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { logo: sportsGear.url, name: "Sport Gear Trading" },
            { logo: easyGas.url, name: "Easy Gas" },
            { logo: focuscore.url, name: "Focuscore" },
            { logo: bbChicken.url, name: "BB Chicken Collagen Broth" },
          ].map((p) => (
            <li
              key={p.name}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border border-border bg-card p-4 text-center"
            >
              <img
                src={p.logo}
                alt={p.name}
                className="h-16 w-auto object-contain"
                loading="lazy"
              />
              <div className="text-xs text-muted-foreground">{p.name}</div>
            </li>
          ))}
        </ul>
      </section>

      {/* Champion bonus award */}
      <section className="mt-8 rounded-lg border border-border p-5">
        <div className="mb-3 flex items-center gap-2 text-foreground">
          <Trophy className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">
            {lang === "mm" ? "ချန်ပီယံ အပိုဆုပစ္စည်း" : "Champion Bonus Award"}
          </h2>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="rounded-md bg-muted/40 px-3 py-2">
            <span className="font-medium">
              {lang === "mm" ? "ချန်ပီယံ — အမျိုးသား" : "Men Champion"}:
            </span>{" "}
            Vittoria Corsa NEXT TLR — 1 Pair
          </li>
          <li className="rounded-md bg-muted/40 px-3 py-2">
            <span className="font-medium">
              {lang === "mm" ? "ချန်ပီယံ — အမျိုးသမီး" : "Women Champion"}:
            </span>{" "}
            Vittoria Rubino TLR — 1 Pair
          </li>
          <li className="rounded-md bg-muted/40 px-3 py-2">
            <span className="font-medium">
              {lang === "mm" ? "ချန်ပီယံ — လူငယ်" : "Junior Champion"}:
            </span>{" "}
            Vittoria Zaffiro — 1 Pair
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          {lang === "mm"
            ? "ပံ့ပိုးပေးသူ — Sport Gear Trading"
            : "Sponsored by Sport Gear Trading."}
        </p>
      </section>

      {/* Event village */}
      <section className="mt-8 rounded-lg border border-border p-5">
        <div className="mb-3 flex items-center gap-2 text-foreground">
          <Store className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">
            {lang === "mm" ? "Event Village / စတိုးများ" : "Event Village / Booths"}
          </h2>
        </div>
        <p className="text-sm text-foreground/90">
          {lang === "mm"
            ? "၂၈ ဇွန် ၂၀၂၆ — သုဝဏ္ဏ ခရိုက်တီးရီယမ်နေ့တွင် MCF ဝင်းအတွင်း ပံ့ပိုးသူ စတိုးများနှင့် event village ဖွင့်လှစ်ပါမည်။ ပရိသတ်၊ ပြိုင်ပွဲဝင်များနှင့် မိသားစုများအား ကြိုဆိုပါသည်။"
            : "On 28 June 2026, sponsor booths and the event village open inside the MCF compound at the Thuwunna Criterium. Open to fans, riders and families throughout race day."}
        </p>
      </section>

      {/* Become a partner */}
      <section className="mt-8 rounded-lg border border-border p-5">
        <div className="mb-3 flex items-center gap-2 text-foreground">
          <Handshake className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">
            {lang === "mm" ? "မိတ်ဖက်ဖြစ်လိုပါက" : "Become a Partner"}
          </h2>
        </div>
        <p className="text-sm text-foreground/90">
          {lang === "mm"
            ? "ပြိုင်ပွဲတွင် ပူးပေါင်းပါဝင်လိုသော ပံ့ပိုးသူများသည် MCF Media ထံသို့ ဆက်သွယ်ပါ။"
            : "Brands and organisations interested in partnership opportunities can reach MCF Media."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href="mailto:pyiwatun@gmail.com?subject=NC2026%20Partnership%20Enquiry"
            className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground hover:opacity-90"
          >
            <Mail className="h-3.5 w-3.5" />
            {lang === "mm" ? "MCF Media သို့ ဆက်သွယ်ရန်" : "Contact MCF Media"}
          </a>
          <Link
            to="/media/contact"
            className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
          >
            {lang === "mm" ? "ဆက်သွယ်ရန် အသေးစိတ်" : "Contact details"}
          </Link>
        </div>
      </section>
    </main>
  );
}
