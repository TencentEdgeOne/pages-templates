import { createClient } from "@supabase/supabase-js";


export const createSupabaseClient = (env, access_token) => {
  return createClient(
    env.PUBLIC_SUPABASE_URL,
    env.PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }
    }
  );
}