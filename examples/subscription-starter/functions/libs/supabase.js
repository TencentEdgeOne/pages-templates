import { createClient } from "@supabase/supabase-js";


export const createSupabaseClient = (env, access_token) => {
  return createClient(
    env.VITE_SUPABASE_URL,
    env.VITE_SUPABASE_ANON_KEY,
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