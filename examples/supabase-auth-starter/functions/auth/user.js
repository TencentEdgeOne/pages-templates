import { createSupabaseClient } from "../libs/supabase";

export async function onRequestGet(context) {
  const { env } = context;
  // parse the cookie to check login status
  const cookies = new Cookies(context.request.headers.get("cookie"));
  if (!cookies.get("sb-access-token")) {
    return new Response("unauthed", { status: 401 });
  }
  const sbAccessToken = cookies.get("sb-access-token").value;
  const supabase = createSupabaseClient(env, sbAccessToken);

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return new Response("unauthed", { status: 401 });
  }
  return new Response(JSON.stringify(data), { status: 200 });
}