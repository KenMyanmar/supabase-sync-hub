// External Supabase admin client — service role, bypasses RLS.
// SERVER-ONLY. Never import this from client-reachable modules at module scope.
// In .functions.ts files, import inside the .handler() with `await import(...)`.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function build(): SupabaseClient {
  const url = process.env.EXT_SUPABASE_URL;
  const serviceKey = process.env.EXT_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Missing EXT_SUPABASE_URL or EXT_SUPABASE_SERVICE_ROLE_KEY. Add them in project Secrets.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let _client: SupabaseClient | undefined;
export function extAdmin(): SupabaseClient {
  if (!_client) _client = build();
  return _client;
}
