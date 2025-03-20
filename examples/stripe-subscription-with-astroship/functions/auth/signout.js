import { createSupabaseClient } from "../libs/supabase";

export async function onRequestGet(context) {
  const { request, env } = context;

  const cookies = new Cookies(request.headers.get("cookie"));
  const sbAccessToken =
    cookies.get("sb-access-token") && cookies.get("sb-access-token").value;
  if (!sbAccessToken) {
    return new Response("User not logged in", 403);
  }
  const supabase = await createSupabaseClient(env, sbAccessToken);

  const { error } = await supabase.auth.signOut();

  if (error) {
    return new Response(error.message, {status: 500})
  }
  return new Response(null, {status: 200});
}
