export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      registration_submissions: {
        Row: {
          coach_name: string | null
          computed_category: string | null
          consent_antidoping: boolean | null
          consent_data: boolean | null
          consent_disqualification: boolean | null
          consent_media: boolean | null
          consent_medical: boolean | null
          consent_rules: boolean | null
          consent_safety: boolean | null
          dob: string | null
          email: string | null
          emergency_name: string | null
          emergency_phone: string | null
          events: string[] | null
          gender: string | null
          guardian_consent: boolean | null
          guardian_name: string | null
          guardian_nrc: string | null
          guardian_phone: string | null
          guardian_relationship: string | null
          guardian_signature: string | null
          height_cm: number | null
          id: string
          ip_hash: string | null
          manager_name: string | null
          manager_phone: string | null
          name_en: string | null
          name_my: string | null
          nationality: string | null
          nrc_or_passport: string | null
          phone: string | null
          possible_duplicate_of: string[] | null
          registration_no: string
          rfid_ack: boolean | null
          rider_type: string | null
          state_region: string | null
          submitted_at: string
          submitter_name: string | null
          team_club: string | null
          township: string | null
          typed_signature: string | null
          uci_ack: boolean | null
          uci_id: string | null
          uci_status: string | null
          user_agent: string | null
          weight_kg: number | null
        }
        Insert: {
          coach_name?: string | null
          computed_category?: string | null
          consent_antidoping?: boolean | null
          consent_data?: boolean | null
          consent_disqualification?: boolean | null
          consent_media?: boolean | null
          consent_medical?: boolean | null
          consent_rules?: boolean | null
          consent_safety?: boolean | null
          dob?: string | null
          email?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          events?: string[] | null
          gender?: string | null
          guardian_consent?: boolean | null
          guardian_name?: string | null
          guardian_nrc?: string | null
          guardian_phone?: string | null
          guardian_relationship?: string | null
          guardian_signature?: string | null
          height_cm?: number | null
          id?: string
          ip_hash?: string | null
          manager_name?: string | null
          manager_phone?: string | null
          name_en?: string | null
          name_my?: string | null
          nationality?: string | null
          nrc_or_passport?: string | null
          phone?: string | null
          possible_duplicate_of?: string[] | null
          registration_no: string
          rfid_ack?: boolean | null
          rider_type?: string | null
          state_region?: string | null
          submitted_at?: string
          submitter_name?: string | null
          team_club?: string | null
          township?: string | null
          typed_signature?: string | null
          uci_ack?: boolean | null
          uci_id?: string | null
          uci_status?: string | null
          user_agent?: string | null
          weight_kg?: number | null
        }
        Update: {
          coach_name?: string | null
          computed_category?: string | null
          consent_antidoping?: boolean | null
          consent_data?: boolean | null
          consent_disqualification?: boolean | null
          consent_media?: boolean | null
          consent_medical?: boolean | null
          consent_rules?: boolean | null
          consent_safety?: boolean | null
          dob?: string | null
          email?: string | null
          emergency_name?: string | null
          emergency_phone?: string | null
          events?: string[] | null
          gender?: string | null
          guardian_consent?: boolean | null
          guardian_name?: string | null
          guardian_nrc?: string | null
          guardian_phone?: string | null
          guardian_relationship?: string | null
          guardian_signature?: string | null
          height_cm?: number | null
          id?: string
          ip_hash?: string | null
          manager_name?: string | null
          manager_phone?: string | null
          name_en?: string | null
          name_my?: string | null
          nationality?: string | null
          nrc_or_passport?: string | null
          phone?: string | null
          possible_duplicate_of?: string[] | null
          registration_no?: string
          rfid_ack?: boolean | null
          rider_type?: string | null
          state_region?: string | null
          submitted_at?: string
          submitter_name?: string | null
          team_club?: string | null
          township?: string | null
          typed_signature?: string | null
          uci_ack?: boolean | null
          uci_id?: string | null
          uci_status?: string | null
          user_agent?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
