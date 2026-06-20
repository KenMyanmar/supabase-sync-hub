// Central bilingual strings — nav, CTAs, empty states, fan/route content.

export const NAV = [
  { to: "/", en: "Overview", mm: "အကျဉ်းချုပ်" },
  { to: "/programme", en: "Programme", mm: "ပြိုင်ပွဲအစီအစဉ်" },
  { to: "/routes", en: "Routes", mm: "လမ်းကြောင်းများ" },
  { to: "/results", en: "Results", mm: "ရလဒ်များ" },
  { to: "/riders", en: "Riders", mm: "ပြိုင်ပွဲဝင်များ" },
  { to: "/fans", en: "Fans", mm: "ပရိသတ်" },
  { to: "/live", en: "Live", mm: "တိုက်ရိုက်" },
  { to: "/media", en: "Media", mm: "သတင်းနှင့်မီဒီယာ" },
  { to: "/guide", en: "Guide", mm: "လမ်းညွှန်" },
  { to: "/partners", en: "Partners", mm: "မိတ်ဖက်" },
] as const;

export const MOBILE_NAV = [
  { to: "/", en: "Overview", mm: "အကျဉ်းချုပ်" },
  { to: "/programme", en: "Programme", mm: "ပြိုင်ပွဲအစီအစဉ်" },
  { to: "/routes", en: "Routes", mm: "လမ်းကြောင်းများ" },
  { to: "/results", en: "Results", mm: "ရလဒ်များ" },
  { to: "/riders", en: "Teams & Riders", mm: "အသင်းများနှင့် ပြိုင်ပွဲဝင်များ" },
  { to: "/riders/watch", en: "Riders to Watch", mm: "စောင့်ကြည့်ထိုက်သူများ" },
  { to: "/fans", en: "For Fans", mm: "ပရိသတ်များအတွက်" },
  { to: "/live", en: "Live Updates", mm: "တိုက်ရိုက်အပ်ဒိတ်" },
  { to: "/media", en: "Media", mm: "သတင်းနှင့်မီဒီယာ" },
  { to: "/guide", en: "Technical Guide", mm: "နည်းပညာလမ်းညွှန်" },
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
  { id: "provisional", en: "Provisional Results", mm: "ယာယီရလဒ်" },
  { id: "results", en: "Official Results", mm: "တရားဝင်ရလဒ်" },
  { id: "points", en: "Points Standing", mm: "အမှတ်ဇယား" },
  { id: "team", en: "Team Standing", mm: "အသင်းအဆင့်" },
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
  downloadGpx: { en: "Download GPX", mm: "GPX ဒေါင်းလုဒ်" },
  viewRoute: { en: "View route details", mm: "လမ်းကြောင်းအသေးစိတ်" },
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
  noLive: {
    en: "Live updates begin on race day.",
    mm: "တိုက်ရိုက်အပ်ဒိတ်များကို ပြိုင်ပွဲနေ့တွင် စတင်ထုတ်ပြန်ပါမည်။",
  },
  noRidersToWatch: {
    en: "Riders to Watch profiles will be published after final start-list confirmation.",
    mm: "စောင့်ကြည့်ထိုက်သူများ၏ ပရိုဖိုင်များကို ပြိုင်ပွဲဝင်စာရင်း တရားဝင်အတည်ပြုပြီးနောက် ထုတ်ပြန်ပါမည်။",
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
  fans: { en: "For Fans", mm: "ပရိသတ်များအတွက်" },
  live: { en: "Live Updates", mm: "တိုက်ရိုက်အပ်ဒိတ်" },
  routes: { en: "Route Details", mm: "လမ်းကြောင်းအသေးစိတ်" },
  ridersWatch: { en: "Riders to Watch", mm: "စောင့်ကြည့်ထိုက်သူများ" },
} as const;

export const LIVE_CATEGORY = {
  road_race: { en: "Road Race", mm: "လမ်းမပြိုင်ပွဲ" },
  women: { en: "Women", mm: "အမျိုးသမီး" },
  mtb: { en: "MTB XCO", mm: "တောင်တက်စက်ဘီး" },
  criterium: { en: "Criterium", mm: "ခရိုက်တီးရီယမ်" },
  general: { en: "General", mm: "အထွေထွေ" },
} as const;

export const RIDER_CATEGORY = {
  men_elite: { en: "Men Elite", mm: "အမျိုးသား Elite" },
  women: { en: "Women", mm: "အမျိုးသမီး" },
  junior: { en: "Junior", mm: "လူငယ်" },
  past_champion: { en: "Past Champions", mm: "ပြီးခဲ့သော ချန်ပီယံများ" },
  sea_games: { en: "SEA Games Hopefuls", mm: "ဆီးဂိမ်း မျှော်လင့်သူများ" },
} as const;

// Stable date format that matches on server and client (avoids hydration mismatch).
export function formatIsoDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatIsoDateTime(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }) + " UTC";
}

// ─── Fans page content ─────────────────────────────────────────────────────
export const FANS = {
  heroTitle: { en: "For Fans", mm: "ပရိသတ်များအတွက်" },
  heroLead: {
    en: "Families, cycling fans, nearby residents and sponsors — come and enjoy the 64th MCF National Cycling Championship. This guide gathers the essentials for a safe, fun race weekend.",
    mm: "မိသားစုများ၊ စက်ဘီးအားကစားဝါသနာရှင်များ၊ နီးစပ်ရာရပ်ကွက်နေသူများနှင့် ပံ့ပိုးသူများ — ၆၄ ကြိမ်မြောက် အမျိုးသား စက်ဘီးချန်ပီယံပြိုင်ပွဲကို လာရောက်အားပေးကြပါ။ ဤလမ်းညွှန်တွင် လုံခြုံစွာ ပျော်ရွှင်စွာ ကြည့်ရှုနိုင်ရန် အချက်အလက်များ စုစည်းထားသည်။",
  },
  raceDays: {
    title: { en: "Race Day Guide", mm: "ပြိုင်ပွဲနေ့ လမ်းညွှန်" },
    items: [
      {
        date: "26 June 2026",
        en: "Road Race · Hlegu 11 Hills Round",
        mm: "လမ်းမပြိုင်ပွဲ · လှည်းကူး ၁၁ တောင်ပတ်",
      },
      {
        date: "27 June 2026",
        en: "MTB XCO · Taikkyi / Mirror Mountains",
        mm: "တောင်တက်စက်ဘီး XCO · တိုက်ကြီး / မှန်တောင်",
      },
      {
        date: "28 June 2026",
        en: "Criterium · Thuwunna outer ring",
        mm: "ခရိုက်တီးရီယမ် · သုဝဏ္ဏ အပြင်ဘက်လမ်း",
      },
    ],
  },
  bestPlaces: {
    title: { en: "Best Places to Watch", mm: "ကြည့်ရှုရန် အကောင်းဆုံးနေရာများ" },
    items: [
      {
        en: "Hlegu start/finish area on Road Race day",
        mm: "လမ်းမပြိုင်ပွဲနေ့ — လှည်းကူး အစ/အဆုံး ဧရိယာ",
      },
      {
        en: "Safe, visible points near turn-around / return sections — only where officials permit",
        mm: "လှည့်ပြန် ဧရိယာအနီးတွင် တာဝန်ရှိသူ ခွင့်ပြုသော နေရာများသာ",
      },
      {
        en: "Thuwunna outer-ring viewing zones (closed circuit, repeated laps)",
        mm: "သုဝဏ္ဏ အပြင်လမ်း ကြည့်ရှုနိုင်သော ဧရိယာများ (လမ်းပိတ်ပြိုင်ပွဲ)",
      },
      {
        en: "MCF compound · Award ceremony area on 28 June",
        mm: "MCF ဝင်းအတွင်း · ၂၈ ဇွန် ဆုပေးပွဲဧရိယာ",
      },
    ],
  },
  criteriumGuide: {
    title: { en: "Thuwunna Criterium Viewing Guide", mm: "သုဝဏ္ဏ ခရိုက်တီးရီယမ် ကြည့်ရှုလမ်းညွှန်" },
    items: [
      {
        en: "Best day for spectators — closed circuit means you stay in one spot and the riders come back every lap.",
        mm: "ပရိသတ်များအတွက် အကောင်းဆုံးနေ့ — လမ်းပိတ်ပြိုင်ပွဲဖြစ်၍ နေရာတစ်ခုတည်းတွင် ထိုင်ကြည့်နိုင်ပြီး ပြိုင်ပွဲဝင်များ အကြိမ်ကြိမ်ဖြတ်သွားသည်။",
      },
      {
        en: "1.3 km lap. Men Junior 15 laps · Women Elite/Open 16 laps · Men Elite 20 laps · Special Open 15 laps.",
        mm: "တစ်ပတ်လျှင် ၁.၃ ကီလိုမီတာ။ Men Junior ၁၅ ပတ် · Women ၁၆ ပတ် · Men Elite ၂၀ ပတ် · Special Open ၁၅ ပတ်။",
      },
      {
        en: "Sponsor booths and event village open the same day at the MCF compound.",
        mm: "ပံ့ပိုးသူ စတိုးများနှင့် Event Village ကို တနေ့တည်းတွင် MCF ဝင်းအတွင်း ဖွင့်လှစ်ပါမည်။",
      },
      {
        en: "Award ceremony immediately follows the criterium races.",
        mm: "ဆုပေးပွဲကို ခရိုက်တီးရီယမ်ပြိုင်ပွဲများ ပြီးသည်နှင့် ဆက်လက်ကျင်းပပါမည်။",
      },
    ],
  },
  arrival: {
    title: { en: "Arrival & Parking", mm: "ရောက်ရှိမှုနှင့် ကားရပ်နားရန်" },
    items: [
      { en: "Arrive early — roads and access change as race time approaches.", mm: "စောစီးစွာ ရောက်ရှိပါ — ပြိုင်ပွဲချိန်နီးချိန်တွင် လမ်းပိတ်မှုများ ရှိနိုင်သည်။" },
      { en: "Follow officials and marshals at all times.", mm: "တာဝန်ရှိသူများ၏ ညွှန်ကြားချက်အတိုင်း လိုက်နာပါ။" },
      { en: "Keep clear of the race course and the finish line.", mm: "ပြိုင်ပွဲလမ်းကြောင်းနှင့် ပန်းတိုင်မှ ဝေးဝေးနေပါ။" },
      { en: "Do not park on course access roads.", mm: "ပြိုင်ပွဲဝင်ထွက်လမ်းများတွင် ကားမရပ်ပါနှင့်။" },
    ],
  },
  safety: {
    title: { en: "Race-Day Safety", mm: "ပြိုင်ပွဲနေ့ လုံခြုံရေး" },
    items: [
      { en: "Keep children away from the course edge.", mm: "ကလေးငယ်များကို လမ်းကြောင်းနှင့် ဝေးအောင် ထိန်းသိမ်းပါ။" },
      { en: "Do not cross while riders or the convoy approach.", mm: "ပြိုင်ပွဲဝင်များ သို့မဟုတ် convoy လာနေချိန်တွင် လမ်းမဖြတ်ပါနှင့်။" },
      { en: "Follow police, marshals and officials at all times.", mm: "ရဲ၊ marshals နှင့် တာဝန်ရှိသူများ၏ ညွှန်ကြားချက်ကို လိုက်နာပါ။" },
      { en: "No motorbikes or bicycles may enter the course without approval.", mm: "ခွင့်ပြုချက်မရှိဘဲ မော်တော်ဆိုင်ကယ်/စက်ဘီး လမ်းကြောင်းအတွင်း ဝင်ခွင့်မပြုပါ။" },
    ],
  },
  awards: {
    title: { en: "Award Ceremony", mm: "ဆုပေးပွဲ" },
    date: { en: "28 June 2026", mm: "၂၀၂၆ ဇွန် ၂၈" },
    location: { en: "MCF compound · Thuwunna", mm: "MCF ဝင်း · သုဝဏ္ဏ" },
    time: { en: "10:00–10:40 (after final Criterium and stage prep)", mm: "၁၀:၀၀–၁၀:၄၀ (နောက်ဆုံး Criterium နှင့် စင်ပြင်ဆင်မှုပြီးနောက်)" },
  },
} as const;

// ─── Route detail content ──────────────────────────────────────────────────
export const ROUTES_CONTENT = [
  {
    slug: "road-race-hlegu-11-hills",
    type: { en: "Road Race", mm: "လမ်းမပြိုင်ပွဲ" },
    name: { en: "Hlegu 11 Hills Round", mm: "လှည်းကူး ၁၁ တောင်ပတ်" },
    date: "26 June 2026",
    distance: "100.98 km",
    elevation: "806 m",
    character: {
      en: "Rolling 11-climb circuit that tests endurance and climbing legs. Selection often forms in the back half on repeated short kickers.",
      mm: "၁၁ တောင်ပတ်လည်လမ်းကြောင်း — ခံနိုင်ရည်နှင့် တောင်တက်စွမ်းကို စမ်းသပ်သည်။ နောက်ပိုင်းအဆို့ထဲ ထပ်ခါထပ်ခါ တိုသော တောင်တိုများက အုပ်စုကို ခွဲထုတ်လေ့ရှိ။",
    },
    sections: [
      { label: { en: "Categories", mm: "အမျိုးအစား" }, value: { en: "Men Elite / Men Junior 100 km · Women Elite/Open 60 km", mm: "Men Elite / Men Junior ၁၀၀ ကီလို · Women Elite/Open ၆၀ ကီလို" } },
      { label: { en: "Climbs", mm: "တောင်များ" }, value: { en: "Approx. 11 climbs along the round", mm: "လည်ပတ်လမ်းကြောင်းတွင် ၁၁ တောင်ခန့်" } },
      { label: { en: "Start / Finish", mm: "အစ / အဆုံး" }, value: { en: "Hlegu — confirmed in Final Team Version", mm: "လှည်းကူး — Final Team Version တွင် အတည်ပြုပါမည်" } },
      { label: { en: "Feed zone", mm: "Feed zone" }, value: { en: "Pending in Final Team Version", mm: "Final Team Version တွင် ထုတ်ပြန်ပါမည်" } },
    ],
    viewingTips: {
      en: "Best to watch near a climb — riders pass slower and the selection is visible. Stay off the road during convoy approach.",
      mm: "တောင်တက်အနီးတွင် ကြည့်ရှုခြင်းက အကောင်းဆုံး — ပြိုင်ပွဲဝင်များ နှေးကွေးပြီး အုပ်စုခွဲမှု ထင်ရှား။ convoy လာချိန် လမ်းပေါ်မထွက်ပါနှင့်။",
    },
    mapAsset: "mcf-route-hlegu",
  },
  {
    slug: "mtb-xco-mirror-mountains",
    type: { en: "MTB XCO", mm: "တောင်တက်စက်ဘီး XCO" },
    name: { en: "Taikkyi / Mirror Mountains", mm: "တိုက်ကြီး / မှန်တောင်" },
    date: "27 June 2026",
    distance: "Pending in Final Team Version",
    elevation: "Pending in Final Team Version",
    character: {
      en: "Technical cross-country circuit on mixed terrain. Repeated short laps reward bike-handling and punchy efforts.",
      mm: "ပေါင်းစပ်မြေပြင်ပေါ်တွင် နည်းပညာဆန်သော cross-country လမ်းကြောင်း။ ထပ်ခါထပ်ခါ တိုသောလမ်းပတ်များက bike-handling နှင့် ဖြတ်ဆတ်သော အားသွန်မှုကို ဆုချသည်။",
    },
    sections: [
      { label: { en: "Discipline", mm: "ပြိုင်ပွဲအမျိုးအစား" }, value: { en: "Cross-country Olympic (XCO)", mm: "Cross-country Olympic (XCO)" } },
      { label: { en: "Venue", mm: "ပြိုင်ပွဲနေရာ" }, value: { en: "Taikkyi / Mirror Mountains area", mm: "တိုက်ကြီး / မှန်တောင် နယ်ပယ်" } },
      { label: { en: "Terrain", mm: "မြေပြင်" }, value: { en: "Mixed singletrack, gravel and technical sections", mm: "singletrack၊ ကျောက်စရစ်ခဲနှင့် နည်းပညာဆန်သော အပိုင်းများ" } },
    ],
    viewingTips: {
      en: "Pick a technical feature with a safe stand-off — riders pass on every lap. Carry water and sun protection.",
      mm: "လုံခြုံသော အကွာအဝေးတွင် နည်းပညာဆန်သော အပိုင်းတစ်ခုကို ရွေးပါ — တစ်ပတ်တိုင်း ဖြတ်သွားသည်။ ရေနှင့် နေပူကာကိရိယာ ယူဆောင်ပါ။",
    },
    mapAsset: null,
  },
  {
    slug: "thuwunna-criterium",
    type: { en: "Criterium", mm: "ခရိုက်တီးရီယမ်" },
    name: { en: "Thuwunna Outer Ring", mm: "သုဝဏ္ဏ အပြင်လမ်း" },
    date: "28 June 2026",
    distance: "1.3 km per lap",
    elevation: "Flat",
    character: {
      en: "Fast, flat closed-circuit criterium on the Thuwunna outer ring. Repeated 1.3 km laps mean constant action and a likely bunch finish.",
      mm: "သုဝဏ္ဏ အပြင်လမ်းရှိ မြန်ဆန်ပြီး ပြန့်ပြူးသော လမ်းပိတ်ပြိုင်ပွဲ။ ၁.၃ ကီလိုလမ်းပတ် ထပ်ခါထပ်ခါ ပတ်ရသဖြင့် မပြတ်တမ်း ပြိုင်ဆိုင်ပြီး အုပ်စုလိုက် finish ဖြစ်ဖွယ်ရှိသည်။",
    },
    sections: [
      { label: { en: "Lap distance", mm: "လမ်းပတ်အရှည်" }, value: { en: "1.3 km", mm: "၁.၃ ကီလိုမီတာ" } },
      { label: { en: "Men Elite", mm: "Men Elite" }, value: { en: "20 laps", mm: "၂၀ ပတ်" } },
      { label: { en: "Women Elite / Open", mm: "Women Elite / Open" }, value: { en: "16 laps", mm: "၁၆ ပတ်" } },
      { label: { en: "Men Junior", mm: "Men Junior" }, value: { en: "15 laps", mm: "၁၅ ပတ်" } },
      { label: { en: "Special Open", mm: "Special Open" }, value: { en: "15 laps", mm: "၁၅ ပတ်" } },
      { label: { en: "Venue", mm: "ပြိုင်ပွဲနေရာ" }, value: { en: "Thuwunna outer-ring road · Yangon", mm: "သုဝဏ္ဏ အပြင်လမ်း · ရန်ကုန်" } },
    ],
    viewingTips: {
      en: "Best fan day. Pick a corner or the start/finish straight — riders pass roughly every two minutes. Award ceremony follows the racing.",
      mm: "ပရိသတ်များအတွက် အကောင်းဆုံးနေ့။ ထောင့်တစ်ခု သို့မဟုတ် အစ/အဆုံးအဖြောင့်အပိုင်းကို ရွေးပါ — ၂ မိနစ်လောက်တိုင်း ပြိုင်ပွဲဝင်များ ဖြတ်သွားသည်။ ပြိုင်ပွဲပြီးနောက် ဆုပေးပွဲကျင်းပပါမည်။",
    },
    mapAsset: "mcf-route-criterium",
  },
] as const;

export type RouteContent = (typeof ROUTES_CONTENT)[number];

export const GPX_PENDING = {
  en: "GPX file pending in Final Team Version.",
  mm: "GPX ဖိုင်ကို Final Team Version တွင် ထုတ်ပြန်ပါမည်။",
} as const;
