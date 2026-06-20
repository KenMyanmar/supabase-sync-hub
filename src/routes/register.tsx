import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { submitRegistration } from "@/lib/registration-submit.functions";
import { useRegistrationOpen } from "@/lib/useRegistrationOpen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import mcfLogo from "@/assets/mcf-mcf-logo.png.asset.json";


export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register / မှတ်ပုံတင်ရန် — MCF National Cycling Event 2026" },
      {
        name: "description",
        content:
          "Official MCF registration form for the 2026 (64th) Myanmar National Cycling Federation တံခွန်စိုက်ဖလားပြိုင်ပွဲ. Bilingual (Myanmar / English). 26–28 June 2026.",
      },
      { property: "og:title", content: "MCF Registration — National Cycling Event 2026" },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: RegisterPage,
});

const STATES = [
  "Kachin", "Kayah", "Kayin", "Chin", "Mon", "Rakhine", "Shan",
  "Sagaing", "Tanintharyi", "Bago", "Magway", "Mandalay", "Yangon",
  "Ayeyarwady", "Naypyidaw", "Other",
] as const;

const EVENTS = ["Road Race", "Criterium", "MTB XCO"] as const;
const RACE_DATE = new Date("2026-06-26");

type FormState = {
  rider_type: "" | "Team" | "Region" | "Club" | "Independent";
  team_club: string;
  manager_name: string;
  manager_phone: string;
  coach_name: string;

  name_my: string;
  name_en: string;
  dob: string;
  gender: "" | "Male" | "Female";
  nationality: string;
  nrc_or_passport: string;
  phone: string;
  email: string;
  township: string;
  state_region: string;
  height_cm: string;
  weight_kg: string;

  emergency_name: string;
  emergency_phone: string;

  guardian_name: string;
  guardian_relationship: string;
  guardian_phone: string;
  guardian_nrc: string;
  guardian_consent: boolean;
  guardian_signature: string;

  events: string[];

  uci_status: "" | "yes" | "no";
  uci_id: string;
  uci_ack: boolean;

  rfid_ack: boolean;

  consent_media: boolean;
  consent_data: boolean;
  consent_medical: boolean;
  consent_safety: boolean;
  consent_rules: boolean;
  consent_disqualification: boolean;
  consent_antidoping: boolean;

  submitter_name: string;
  typed_signature: string;
};

const empty: FormState = {
  rider_type: "", team_club: "", manager_name: "", manager_phone: "", coach_name: "",
  name_my: "", name_en: "", dob: "", gender: "", nationality: "Myanmar",
  nrc_or_passport: "", phone: "", email: "", township: "", state_region: "",
  height_cm: "", weight_kg: "",
  emergency_name: "", emergency_phone: "",
  guardian_name: "", guardian_relationship: "", guardian_phone: "",
  guardian_nrc: "", guardian_consent: false, guardian_signature: "",
  events: [],
  uci_status: "", uci_id: "", uci_ack: false,
  rfid_ack: false,
  consent_media: false, consent_data: false, consent_medical: false,
  consent_safety: false, consent_rules: false, consent_disqualification: false,
  consent_antidoping: false,
  submitter_name: "", typed_signature: "",
};

function ageOnRaceDay(dobIso: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dobIso)) return null;
  const dob = new Date(dobIso);
  if (Number.isNaN(dob.getTime())) return null;
  let a = RACE_DATE.getFullYear() - dob.getFullYear();
  const m = RACE_DATE.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && RACE_DATE.getDate() < dob.getDate())) a--;
  return a;
}
function computeCategory(age: number | null, gender: string): string {
  if (age == null || !gender) return "—";
  const p = gender === "Female" ? "Women" : "Men";
  if (age < 18) return `${p} Junior`;
  if (age < 40) return `${p} Elite`;
  return `${p} Master`;
}

const CONSENTS: Array<{ key: keyof FormState; label: string; my: string }> = [
  { key: "consent_media", label: "Media & Image Use", my: "မီဒီယာနှင့် ဓါတ်ပုံအသုံးပြုခွင့်" },
  { key: "consent_data", label: "Personal Data Use", my: "ကိုယ်ရေးအချက်အလက် အသုံးပြုခွင့်" },
  { key: "consent_medical", label: "Medical Care & Insurance Awareness", my: "ဆေးကုသမှု / အာမခံ သိရှိခြင်း" },
  { key: "consent_safety", label: "Personal Safety Responsibility", my: "ကိုယ်ပိုင် ဘေးကင်းရေး တာဝန်ယူခြင်း" },
  { key: "consent_rules", label: "Rules & Race Regulations", my: "စည်းမျဉ်းနှင့် ပြိုင်ပွဲစည်းကမ်း" },
  { key: "consent_disqualification", label: "Disqualification Acknowledgement", my: "အရည်အချင်းပိတ်ပင်ခြင်း သိရှိ" },
  { key: "consent_antidoping", label: "Anti-Doping Compliance", my: "Anti-Doping စည်းကမ်း လိုက်နာခြင်း" },
];

function RegisterPage() {
  const submit = useServerFn(submitRegistration);
  const [step, setStep] = useState(0);
  const [s, setS] = useState<FormState>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const age = useMemo(() => ageOnRaceDay(s.dob), [s.dob]);
  const isMinor = age != null && age < 18;
  const category = computeCategory(age, s.gender);
  const isIndependent = s.rider_type === "Independent";

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setS((p) => ({ ...p, [k]: v }));
  }
  function toggleEvent(e: string) {
    setS((p) => ({
      ...p,
      events: p.events.includes(e) ? p.events.filter((x) => x !== e) : [...p.events, e],
    }));
  }

  // Step plan (skip step 4 guardian if not minor)
  const steps = useMemo(() => {
    const base = ["type", "team", "personal"];
    if (isMinor) base.push("guardian");
    base.push("events", "uci", "rfid", "consents", "confirm");
    return base;
  }, [isMinor]);
  const current = steps[step];
  const isLast = step === steps.length - 1;

  function validateStep(): string | null {
    switch (current) {
      case "type":
        if (!s.rider_type) return "Please select rider type.";
        return null;
      case "team":
        if (!isIndependent && !s.team_club.trim()) return "Team / Club / Region name is required.";
        return null;
      case "personal":
        if (!s.name_my.trim()) return "Myanmar name required.";
        if (!s.name_en.trim()) return "English name required.";
        if (!s.dob) return "Date of birth required.";
        if (!s.gender) return "Gender required.";
        if (!s.nationality.trim()) return "Nationality required.";
        if (!s.nrc_or_passport.trim()) return "NRC / Passport required.";
        if (!s.phone.trim()) return "Phone required.";
        if (!s.township.trim()) return "Township required.";
        if (!s.state_region) return "State / Region required.";
        if (!s.emergency_name.trim()) return "Emergency contact name required.";
        if (!s.emergency_phone.trim()) return "Emergency contact phone required.";
        return null;
      case "guardian":
        if (!s.guardian_name.trim()) return "Guardian name required.";
        if (!s.guardian_phone.trim()) return "Guardian phone required.";
        if (!s.guardian_consent) return "Guardian must consent.";
        if (!s.guardian_signature.trim()) return "Guardian signature required.";
        return null;
      case "events":
        if (s.events.length === 0) return "Select at least one event.";
        return null;
      case "uci":
        if (!s.uci_status) return "Please select UCI status.";
        if (s.uci_status === "yes" && !s.uci_id.trim()) return "UCI ID required.";
        if (!s.uci_ack) return "Please acknowledge.";
        return null;
      case "rfid":
        if (!s.rfid_ack) return "Please acknowledge RFID deposit.";
        return null;
      case "consents":
        for (const c of CONSENTS) {
          if (!s[c.key]) return `Please tick: ${c.label}`;
        }
        return null;
      case "confirm":
        if (!s.submitter_name.trim()) return "Submitter name required.";
        if (!s.typed_signature.trim()) return "Typed signature required.";
        return null;
    }
    return null;
  }

  async function next() {
    const v = validateStep();
    if (v) { setError(v); return; }
    setError(null);
    if (!isLast) { setStep(step + 1); return; }
    await doSubmit();
  }
  function back() { setError(null); setStep(Math.max(0, step - 1)); }

  async function doSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        rider_type: s.rider_type as Exclude<FormState["rider_type"], "">,
        team_club: s.team_club,
        manager_name: s.manager_name,
        manager_phone: s.manager_phone,
        coach_name: s.coach_name,
        name_my: s.name_my,
        name_en: s.name_en,
        dob: s.dob,
        gender: s.gender as "Male" | "Female",
        nationality: s.nationality,
        nrc_or_passport: s.nrc_or_passport,
        phone: s.phone,
        email: s.email,
        township: s.township,
        state_region: s.state_region as (typeof STATES)[number],
        height_cm: s.height_cm ? Number(s.height_cm) : null,
        weight_kg: s.weight_kg ? Number(s.weight_kg) : null,
        emergency_name: s.emergency_name,
        emergency_phone: s.emergency_phone,
        guardian_name: s.guardian_name,
        guardian_relationship: s.guardian_relationship,
        guardian_phone: s.guardian_phone,
        guardian_nrc: s.guardian_nrc,
        guardian_consent: s.guardian_consent,
        guardian_signature: s.guardian_signature,
        events: s.events as Array<(typeof EVENTS)[number]>,
        uci_status: s.uci_status as "yes" | "no",
        uci_id: s.uci_id,
        uci_ack: s.uci_ack,
        rfid_ack: s.rfid_ack,
        consent_media: s.consent_media,
        consent_data: s.consent_data,
        consent_medical: s.consent_medical,
        consent_safety: s.consent_safety,
        consent_rules: s.consent_rules,
        consent_disqualification: s.consent_disqualification,
        consent_antidoping: s.consent_antidoping,
        submitter_name: s.submitter_name,
        typed_signature: s.typed_signature,
      };
      const r = await submit({ data: payload });
      setResult(r.registration_no);
    } catch (e: any) {
      setError(e?.message ?? "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) return <SuccessScreen regNo={result} />;

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={mcfLogo.url} alt="MCF" className="h-8 w-8 rounded bg-white p-0.5" />
            <span className="text-sm font-semibold">MCF Registration</span>
          </Link>
          <Link to="/" className="text-xs underline opacity-80 hover:opacity-100">
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 pb-24">
        <div className="mb-4">
          <h1 className="text-xl font-bold sm:text-2xl">
            မှတ်ပုံတင်ခြင်း / Registration
          </h1>
          <p className="text-sm text-muted-foreground">
            ၂၀၂၆ (၆၄ ကြိမ်မြောက်) တံခွန်စိုက်ဖလားပြိုင်ပွဲ — 26–28 June 2026
          </p>
        </div>

        <ol className="mb-4 flex flex-wrap items-center gap-1 text-xs">
          {steps.map((id, i) => (
            <li
              key={id}
              className={
                "rounded-full border px-2 py-0.5 " +
                (i === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : i < step
                  ? "border-accent bg-accent/10 text-foreground"
                  : "border-border text-muted-foreground")
              }
            >
              {i + 1}
            </li>
          ))}
          <li className="ml-2 text-muted-foreground">
            Step {step + 1} / {steps.length}
          </li>
        </ol>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
          {current === "type" && (
            <StepWrap title="အမျိုးအစား / Rider Type">
              <RadioGroup
                value={s.rider_type}
                onValueChange={(v) => set("rider_type", v as FormState["rider_type"])}
                className="space-y-2"
              >
                {[
                  ["Team", "Team / အသင်း"],
                  ["Region", "State / Region / တိုင်း"],
                  ["Club", "Club / ကလပ်"],
                  ["Independent", "Independent Rider / တစ်ဦးချင်း"],
                ].map(([val, label]) => (
                  <Label key={val} className="flex cursor-pointer items-center gap-3 rounded-md border border-border p-3 hover:bg-muted">
                    <RadioGroupItem value={val} />
                    <span>{label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </StepWrap>
          )}

          {current === "team" && !isIndependent && (
            <StepWrap title="အသင်း / ဒေသ အချက်အလက် / Team & Region Details">
              <Field label="Team / Club / State / Region Name *" my="အသင်း / ကလပ် / ပြည်နယ် / တိုင်း အမည်">
                <Input value={s.team_club} onChange={(e) => set("team_club", e.target.value)} />
              </Field>
              <Field label="Manager Name" my="အသင်းအုပ်ချုပ်သူ အမည်">
                <Input value={s.manager_name} onChange={(e) => set("manager_name", e.target.value)} />
              </Field>
              <Field label="Manager Phone" my="အသင်းအုပ်ချုပ်သူ ဖုန်း">
                <Input value={s.manager_phone} onChange={(e) => set("manager_phone", e.target.value)} />
              </Field>
              <Field label="Coach Name" my="နည်းပြ အမည်">
                <Input value={s.coach_name} onChange={(e) => set("coach_name", e.target.value)} />
              </Field>
            </StepWrap>
          )}
          {current === "team" && isIndependent && (
            <StepWrap title="Independent Rider Notice / တစ်ဦးချင်း သတိပေးချက်">
              <p className="text-sm">
                Independent Riders may register without a team or region. However, MCF reserves
                the right to verify eligibility, age, category, and licensing status.
              </p>
              <p lang="my" className="text-sm text-muted-foreground">
                တစ်ဦးချင်း ပြိုင်သူများသည် အသင်း / ဒေသ မပါဘဲ စာရင်းသွင်းနိုင်သော်လည်း MCF မှ စိစစ်ပိုင်ခွင့်ရှိပါသည်။
              </p>
            </StepWrap>
          )}

          {current === "personal" && (
            <StepWrap title="ကိုယ်ရေးအချက်အလက် / Personal Information">
              <Field label="Full Name (Myanmar) *" my="အမည် (မြန်မာ)">
                <Input value={s.name_my} onChange={(e) => set("name_my", e.target.value)} />
              </Field>
              <Field label="Full Name (English) *" my="အမည် (English)">
                <Input value={s.name_en} onChange={(e) => set("name_en", e.target.value)} />
              </Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Date of Birth *" my="မွေးနေ့">
                  <Input type="date" value={s.dob} onChange={(e) => set("dob", e.target.value)} />
                </Field>
                <Field label="Gender *" my="ကျား / မ">
                  <Select value={s.gender} onValueChange={(v) => set("gender", v as FormState["gender"])}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male / ကျား</SelectItem>
                      <SelectItem value="Female">Female / မ</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              {age != null && (
                <p className="text-xs text-muted-foreground">
                  Age on race day (26 June 2026): <span className="font-semibold text-foreground">{age}</span>
                </p>
              )}
              <Field label="Nationality *" my="နိုင်ငံသား">
                <Input value={s.nationality} onChange={(e) => set("nationality", e.target.value)} />
              </Field>
              <Field label="NRC / Passport No *" my="မှတ်ပုံတင် / နိုင်ငံကူးလက်မှတ်">
                <Input value={s.nrc_or_passport} onChange={(e) => set("nrc_or_passport", e.target.value)} />
              </Field>
              <Field label="Phone / Viber *" my="ဖုန်း / Viber">
                <Input value={s.phone} onChange={(e) => set("phone", e.target.value)} inputMode="tel" />
              </Field>
              <Field label="Email" my="အီးမေးလ်">
                <Input type="email" value={s.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Township *" my="မြို့နယ်">
                  <Input value={s.township} onChange={(e) => set("township", e.target.value)} />
                </Field>
                <Field label="State / Region *" my="ပြည်နယ် / တိုင်း">
                  <Select value={s.state_region} onValueChange={(v) => set("state_region", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {STATES.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Height (cm)" my="အရပ် (စင်တီမီတာ)">
                  <Input type="number" value={s.height_cm} onChange={(e) => set("height_cm", e.target.value)} />
                </Field>
                <Field label="Weight (kg)" my="ကိုယ်အလေးချိန် (ကီလို)">
                  <Input type="number" value={s.weight_kg} onChange={(e) => set("weight_kg", e.target.value)} />
                </Field>
              </div>
              <div className="mt-4 border-t border-border pt-4">
                <p className="mb-2 text-sm font-semibold">အရေးပေါ်ဆက်သွယ်ရန် / Emergency Contact</p>
                <Field label="Name *" my="အမည်">
                  <Input value={s.emergency_name} onChange={(e) => set("emergency_name", e.target.value)} />
                </Field>
                <Field label="Phone *" my="ဖုန်း">
                  <Input value={s.emergency_phone} onChange={(e) => set("emergency_phone", e.target.value)} />
                </Field>
              </div>
            </StepWrap>
          )}

          {current === "guardian" && (
            <StepWrap title="အုပ်ထိန်းသူ ခွင့်ပြုချက် / Guardian Consent (Under 18)">
              <div className="rounded-md border border-accent/40 bg-accent/10 p-3 text-sm">
                Rider is <span className="font-semibold">{age}</span> on race day. Guardian
                consent is required.
              </div>
              <Field label="Guardian Name *" my="အုပ်ထိန်းသူ အမည်">
                <Input value={s.guardian_name} onChange={(e) => set("guardian_name", e.target.value)} />
              </Field>
              <Field label="Relationship" my="ဆက်စပ်မှု">
                <Input value={s.guardian_relationship} onChange={(e) => set("guardian_relationship", e.target.value)} />
              </Field>
              <Field label="Guardian Phone *" my="အုပ်ထိန်းသူ ဖုန်း">
                <Input value={s.guardian_phone} onChange={(e) => set("guardian_phone", e.target.value)} />
              </Field>
              <Field label="Guardian NRC" my="အုပ်ထိန်းသူ မှတ်ပုံတင်">
                <Input value={s.guardian_nrc} onChange={(e) => set("guardian_nrc", e.target.value)} />
              </Field>
              <CheckboxRow
                checked={s.guardian_consent}
                onChange={(v) => set("guardian_consent", v)}
                label="I, as guardian, consent to this rider's participation."
                my="ကျွန်ုပ်သည် အုပ်ထိန်းသူအနေဖြင့် သဘောတူပါသည်။"
              />
              <Field label="Guardian Signature (type full name) *" my="အုပ်ထိန်းသူ လက်မှတ် (အမည်ရိုက်ထည့်ပါ)">
                <Input value={s.guardian_signature} onChange={(e) => set("guardian_signature", e.target.value)} />
              </Field>
            </StepWrap>
          )}

          {current === "events" && (
            <StepWrap title="အမျိုးအစား နှင့် ပြိုင်ပွဲ / Category & Events">
              <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
                Computed category: <span className="font-semibold">{category}</span>
                <div className="text-xs text-muted-foreground">
                  Auto-calculated from DOB & gender. MCF will verify.
                </div>
              </div>
              <p className="text-sm font-medium">Events / ပြိုင်ပွဲများ *</p>
              {EVENTS.map((e) => (
                <CheckboxRow
                  key={e}
                  checked={s.events.includes(e)}
                  onChange={() => toggleEvent(e)}
                  label={e}
                  my={e === "Road Race" ? "လမ်းပြိုင်ပွဲ" : e === "Criterium" ? "Criterium" : "MTB XCO"}
                />
              ))}
              {s.events.includes("MTB XCO") && (
                <div className="rounded-md border border-accent/40 bg-accent/10 p-3 text-xs">
                  Note: MTB XCO is a separate event and does NOT count toward
                  တံခွန်စိုက်ဖလား points.
                </div>
              )}
            </StepWrap>
          )}

          {current === "uci" && (
            <StepWrap title="UCI / MCF License">
              <p className="text-sm">Do you currently hold a UCI ID? / UCI ID ရှိပါသလား?</p>
              <RadioGroup value={s.uci_status} onValueChange={(v) => set("uci_status", v as FormState["uci_status"])}>
                <Label className="flex items-center gap-3 rounded-md border border-border p-3">
                  <RadioGroupItem value="yes" /> Yes / ရှိသည်
                </Label>
                <Label className="flex items-center gap-3 rounded-md border border-border p-3">
                  <RadioGroupItem value="no" /> No / မရှိ
                </Label>
              </RadioGroup>
              {s.uci_status === "yes" && (
                <Field label="UCI ID *" my="UCI ID">
                  <Input value={s.uci_id} onChange={(e) => set("uci_id", e.target.value)} />
                </Field>
              )}
              <CheckboxRow
                checked={s.uci_ack}
                onChange={(v) => set("uci_ack", v)}
                label="I acknowledge that final licensing & eligibility verification is by MCF."
                my="အပြီးသတ် စိစစ်ခြင်းကို MCF မှ ဆောင်ရွက်ကြောင်း သိရှိပါသည်။"
              />
            </StepWrap>
          )}

          {current === "rfid" && (
            <StepWrap title="RFID Chip Deposit">
              <p className="text-sm">
                A refundable RFID chip deposit is required at race-day check-in. The chip must be
                returned after the event; deposit will be refunded.
              </p>
              <p lang="my" className="text-sm text-muted-foreground">
                ပြိုင်ပွဲနေ့တွင် RFID chip အပ်ငွေ ပေးသွင်းရပါမည်။ ပြိုင်ပွဲပြီးနောက် chip ပြန်အပ်ပါက အပ်ငွေ ပြန်အမ်းပါမည်။
              </p>
              <CheckboxRow
                checked={s.rfid_ack}
                onChange={(v) => set("rfid_ack", v)}
                label="I acknowledge the RFID deposit requirement."
                my="RFID အပ်ငွေ စည်းကမ်းကို သိရှိပါသည်။"
              />
            </StepWrap>
          )}

          {current === "consents" && (
            <StepWrap title="သဘောတူညီချက်များ / Consents (all required)">
              {CONSENTS.map((c) => (
                <CheckboxRow
                  key={c.key as string}
                  checked={Boolean(s[c.key])}
                  onChange={(v) => set(c.key, v as never)}
                  label={c.label}
                  my={c.my}
                />
              ))}
            </StepWrap>
          )}

          {current === "confirm" && (
            <StepWrap title="အတည်ပြုခြင်း / Final Confirmation">
              <p className="text-sm">
                I confirm that the information provided is true and complete to the best of my knowledge.
              </p>
              <p lang="my" className="text-sm text-muted-foreground">
                ဖော်ပြထားသော အချက်အလက်များသည် မှန်ကန်ပြည့်စုံကြောင်း အတည်ပြုပါသည်။
              </p>
              <Field label="Submitter Name *" my="တင်သွင်းသူ အမည်">
                <Input value={s.submitter_name} onChange={(e) => set("submitter_name", e.target.value)} />
              </Field>
              <Field label="Typed Signature (full name) *" my="လက်မှတ် (အမည်ရိုက်)">
                <Input value={s.typed_signature} onChange={(e) => set("typed_signature", e.target.value)} />
              </Field>
            </StepWrap>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="outline" type="button" onClick={back} disabled={step === 0 || submitting}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button type="button" onClick={next} disabled={submitting}>
              {isLast ? (submitting ? "Submitting…" : "Submit") : (<>Next <ArrowRight className="h-4 w-4 ml-1" /></>)}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StepWrap({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, my, children }: { label: string; my?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-sm">
        {label}
        {my && <span lang="my" className="ml-2 text-xs text-muted-foreground">{my}</span>}
      </Label>
      {children}
    </div>
  );
}

function CheckboxRow({
  checked, onChange, label, my,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; my?: string }) {
  return (
    <Label className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 hover:bg-muted">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} className="mt-0.5" />
      <span className="text-sm">
        {label}
        {my && <span lang="my" className="ml-2 text-xs text-muted-foreground">{my}</span>}
      </span>
    </Label>
  );
}

function SuccessScreen({ regNo }: { regNo: string }) {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <main className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-lg border border-accent/40 bg-card p-6 shadow-sm sm:p-8">
          <CheckCircle2 className="h-10 w-10 text-accent" />
          <h1 className="mt-3 text-2xl font-bold">
            မှတ်ပုံတင်ခြင်း လက်ခံရရှိပါပြီ / Registration Received
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your registration has been received by MCF.
          </p>
          <div className="mt-4 rounded-md border border-border bg-muted/40 p-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Registration ID
            </div>
            <div className="text-2xl font-bold text-primary">{regNo}</div>
          </div>
          <p lang="my" className="mt-4 text-sm">
            ဤစာရင်းသည် <strong>Registration Received List</strong> သာ ဖြစ်ပါသည်။ Final
            Start List မဟုတ်သေးပါ။ MCF မှ category, age, event, MCF/UCI ID နှင့်
            eligibility စိစစ်ပြီးနောက် Final Start List ကို ထပ်မံကြေညာပေးသွားမည် ဖြစ်ပါသည်။
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/"
              hash="status"
              className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground"
            >
              Check Registration Status
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-sm font-semibold"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
