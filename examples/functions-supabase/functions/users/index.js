import { createClient } from '@supabase/supabase-js';

export async function onRequest({ request, params, env }) {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);

  let { data } = await supabase.from('users').select('*');

  return new Response(
    JSON.stringify({
      users: data,
    }),
    {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
