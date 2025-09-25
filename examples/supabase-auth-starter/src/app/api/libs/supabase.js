import { createClient } from '@supabase/supabase-js';

/**
 * Create Supabase client
 * @param {string} accessToken - access token
 * @param {string} supabaseUrl - supabase url
 * @param {string} supabaseKey - supabase key
 * @returns {Object} Supabase client instance
 */
export function createSupabaseClient(supabaseUrl, supabaseKey, accessToken = null) {
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    },
    global: {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  });
}

/**
 * Cookie configuration options
 */
export const cookieOptions = {
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: true,
  sameSite: 'lax',
  httpOnly: false,
};