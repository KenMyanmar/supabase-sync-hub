import { createServerFn } from "@tanstack/react-start";

export type PublicRider = {
  registration_no: string;
  name_en: string | null;
  name_my: string | null;
  category: "Men Elite" | "Men Junior" | "Women" | "Uncategorized";
  in_road: boolean;
  in_crit: boolean;
  in_mtb: boolean;
  status: "confirmed" | "provisional";
};

export const getPublicRiders = createServerFn({ method: "POST" }).handler(
  async (): Promise<PublicRider[]> => {
    try {
      const { extAdmin } = await import("@/integrations/ext-supabase/admin.server");
      const { data, error } = await extAdmin()
        .from("public_riders")
        .select(
          "registration_no, name_en, name_my, category, in_road, in_crit, in_mtb, status",
        )
        .order("category", { ascending: true })
        .order("name_en", { ascending: true });
      if (error) {
        console.error("[public-riders]", error);
        return [];
      }
      return (data as PublicRider[]) ?? [];
    } catch (e) {
      console.error("[public-riders] threw", e);
      return [];
    }
  },
);
