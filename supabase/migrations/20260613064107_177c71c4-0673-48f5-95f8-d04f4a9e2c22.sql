
CREATE TABLE public.registration_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_no text UNIQUE NOT NULL,
  submitted_at timestamptz NOT NULL DEFAULT now(),

  rider_type text,
  team_club text,
  manager_name text,
  manager_phone text,
  coach_name text,

  name_my text,
  name_en text,
  dob date,
  gender text,
  nationality text,
  nrc_or_passport text,
  phone text,
  email text,
  township text,
  state_region text,
  height_cm numeric,
  weight_kg numeric,

  emergency_name text,
  emergency_phone text,

  guardian_name text,
  guardian_relationship text,
  guardian_phone text,
  guardian_nrc text,
  guardian_consent boolean,
  guardian_signature text,

  computed_category text,
  events text[],

  uci_status text,
  uci_id text,
  uci_ack boolean,

  rfid_ack boolean,

  consent_media boolean,
  consent_data boolean,
  consent_medical boolean,
  consent_safety boolean,
  consent_rules boolean,
  consent_disqualification boolean,
  consent_antidoping boolean,

  submitter_name text,
  typed_signature text,

  user_agent text,
  ip_hash text,
  possible_duplicate_of text[]
);

-- Service role only. No grants to anon/authenticated → unreachable via PostgREST.
GRANT ALL ON public.registration_submissions TO service_role;

ALTER TABLE public.registration_submissions ENABLE ROW LEVEL SECURITY;
-- Intentionally NO policies. Only service-role (extAdmin) can read/write.
