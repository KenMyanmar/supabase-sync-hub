// Central bilingual strings — nav, CTAs, empty states.
// Keep small and explicit; per-page copy lives in the routes.

export const NAV = [
  { to: "/", en: "Overview", mm: "အကျဉ်းချုပ်" },
  { to: "/programme", en: "Programme", mm: "ပြိုင်ပွဲအစီအစဉ်" },
  { to: "/results", en: "Results", mm: "ရလဒ်များ" },
  { to: "/riders", en: "Teams & Riders", mm: "အသင်းများနှင့် ပြိုင်ပွဲဝင်များ" },
  { to: "/media", en: "Media", mm: "သတင်းနှင့်မီဒီယာ" },
  { to: "/guide", en: "Guide", mm: "နည်းပညာလမ်းညွှန်" },
  { to: "/partners", en: "Partners", mm: "မိတ်ဖက်များ" },
] as const;

// Mobile order: Register first (the button is separate), then this:
export const MOBILE_NAV = [
  { to: "/programme", en: "Programme", mm: "ပြိုင်ပွဲအစီအစဉ်" },
  { to: "/results", en: "Results", mm: "ရလဒ်များ" },
  { to: "/riders", en: "Teams & Riders", mm: "အသင်းများနှင့် ပြိုင်ပွဲဝင်များ" },
  { to: "/", en: "Overview", mm: "အကျဉ်းချုပ်" },
  { to: "/media", en: "Media", mm: "သတင်းနှင့်မီဒီယာ" },
  { to: "/guide", en: "Guide", mm: "နည်းပညာလမ်းညွှန်" },
  { to: "/partners", en: "Partners", mm: "မိတ်ဖက်များ" },
] as const;

export const MEDIA_SUBNAV = [
  { to: "/media", en: "News", mm: "သတင်း" },
  { to: "/media/press", en: "Press Releases", mm: "သတင်းထုတ်ပြန်ချက်" },
  { to: "/media/gallery", en: "Gallery", mm: "ဓာတ်ပုံ" },
  { to: "/media/contact", en: "Media Contact", mm: "မီဒီယာ ဆက်သွယ်ရန်" },
] as const;

export const RESULTS_TABS = [
  { id: "start-lists", en: "Start Lists", mm: "ပြိုင်ပွဲဝင်စာရင်း" },
  { id: "results", en: "Results", mm: "ရလဒ်များ" },
  { id: "standings", en: "Standings", mm: "ရပ်တည်မှု" },
  { id: "points", en: "Points", mm: "အမှတ်" },
  { id: "medal", en: "Medal Table", mm: "ဆုတံဆိပ်ဇယား" },
  { id: "notices", en: "Official Notices", mm: "တရားဝင်ထုတ်ပြန်ချက်" },
] as const;

export const CTA = {
  register: { en: "Register", mm: "စာရင်းသွင်းရန်" },
  checkStatus: { en: "Check Status", mm: "စာရင်းသွင်းမှု စစ်ဆေးရန်" },
  downloadGuide: { en: "Download Guide", mm: "လမ်းညွှန်ဒေါင်းလုဒ်ရယူရန်" },
  viewResults: { en: "View Results", mm: "ရလဒ်များကြည့်ရန်" },
  readMore: { en: "Read more", mm: "ဆက်ဖတ်ရန်" },
  back: { en: "Back", mm: "နောက်သို့" },
} as const;

export const EMPTY = {
  commissairesPending: {
    en: "Results and standings will be published here after official confirmation by the commissaires panel.",
    mm: "ရလဒ်များနှင့် အမှတ်ရပ်တည်မှုများကို Commissaires Panel မှ တရားဝင်အတည်ပြုပြီးနောက် ဤနေရာတွင် ထုတ်ပြန်ပါမည်။",
  },
  noPressReleases: {
    en: "No press releases yet. Check back closer to race week.",
    mm: "သတင်းထုတ်ပြန်ချက် မရှိသေးပါ။ ပြိုင်ပွဲရက်အနီးတွင် ပြန်လည်ကြည့်ပါ။",
  },
  noNews: {
    en: "No news posts yet.",
    mm: "သတင်းတင်ထားခြင်း မရှိသေးပါ။",
  },
  noNotices: {
    en: "No official notices have been issued yet.",
    mm: "တရားဝင်ထုတ်ပြန်ချက် မရှိသေးပါ။",
  },
  noGallery: {
    en: "Gallery will open after the event.",
    mm: "ပြိုင်ပွဲပြီးနောက် ဓာတ်ပုံပြခန်း ဖွင့်ပါမည်။",
  },
  noRiders: {
    en: "Confirmed riders and teams will be listed here.",
    mm: "အတည်ပြုပြီးသော ပြိုင်ပွဲဝင်များနှင့် အသင်းများကို ဤနေရာတွင် ထုတ်ပြန်ပါမည်။",
  },
} as const;

export const SECTION = {
  overview: { en: "Overview", mm: "အကျဉ်းချုပ်" },
  programme: { en: "Programme", mm: "ပြိုင်ပွဲအစီအစဉ်" },
  results: { en: "Results & Standings", mm: "ရလဒ်များနှင့် ရပ်တည်မှု" },
  riders: { en: "Teams & Riders", mm: "အသင်းများနှင့် ပြိုင်ပွဲဝင်များ" },
  media: { en: "Media Centre", mm: "မီဒီယာစင်တာ" },
  press: { en: "Press Releases", mm: "သတင်းထုတ်ပြန်ချက်" },
  guide: { en: "Technical Guide", mm: "နည်းပညာလမ်းညွှန်" },
  partners: { en: "Partners & Organisers", mm: "မိတ်ဖက်နှင့် စည်းရုံးရေး" },
} as const;
