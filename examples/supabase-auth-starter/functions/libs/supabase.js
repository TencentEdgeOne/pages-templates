import { createClient } from "@supabase/supabase-js";


export const createSupabaseClient = (env, access_token) => {
  return createClient(
    env.SUPABASE_URL,
    env.SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      },
      global: {
        headers: access_token ? {
          Authorization: `Bearer ${access_token}`
        } : {}
      }
    }
  );
}