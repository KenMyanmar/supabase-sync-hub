import { createFileRoute } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/media/contact")({
  head: () => ({
    meta: [{ title: "Media Contact — MCF National Cycling Event 2026" }],
  }),
  component: MediaContact,
});

function MediaContact() {
  const { lang } = useLang();
  return (
    <div className="max-w-2xl space-y-3 text-sm">
      <h2 className="text-lg font-semibold">
        {lang === "mm" ? "မီဒီယာ ဆက်သွယ်ရန်" : "Media Contact"}
      </h2>
      <p className="text-muted-foreground">
        {lang === "mm"
          ? "သတင်းမီဒီယာ မှတ်ပုံတင်ခြင်းနှင့် ဆက်သွယ်စုံစမ်းရန် Myanmar Cycling Federation သို့ ဆက်သွယ်ပါ။"
          : "For media accreditation and press enquiries, please contact the Myanmar Cycling Federation."}
      </p>
      <p>
        <a
          href="mailto:pyiwatun@gmail.com"
          className="text-primary underline"
        >
          pyiwatun@gmail.com
        </a>
      </p>
    </div>
  );
}
