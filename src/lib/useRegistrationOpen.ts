import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getSiteSettings } from "@/lib/site-content.functions";

const FALLBACK_MM =
  "အမျိုးသား စက်ဘီးပြိုင်ပွဲ (၆၄) ကြိမ်မြောက် ၂၀၂၆ အတွက် မှတ်ပုံတင်ခြင်းကို ပိတ်သိမ်းပြီးဖြစ်ပါသည်။";
const FALLBACK_EN =
  "Registration for the 64th Myanmar National Cycling Championship 2026 is now closed.";

export type RegistrationOpenState = {
  loading: boolean;
  open: boolean;
  messageMm: string;
  messageEn: string;
};

export function useRegistrationOpen(): RegistrationOpenState {
  const fn = useServerFn(getSiteSettings);
  const { data, isLoading } = useQuery({
    queryKey: ["site_settings"],
    queryFn: () => fn(),
    staleTime: 60_000,
  });
  return {
    loading: isLoading,
    open: data?.registration_open === true,
    messageMm: (data?.registration_closed_message_mm || "").trim() || FALLBACK_MM,
    messageEn: (data?.registration_closed_message_en || "").trim() || FALLBACK_EN,
  };
}
