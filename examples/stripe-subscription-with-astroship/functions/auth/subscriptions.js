import { createSupabaseClient } from "../libs/supabase";

export async function onRequestGet(context) {
  const { request, env } = context;

  const cookies = new Cookies(request.headers.get("cookie"));
  const sbAccessToken =
    cookies.get("sb-access-token") && cookies.get("sb-access-token").value;

  const supabase = await createSupabaseClient(env, sbAccessToken);

  const { data: subscriptions, error } = await supabase
    .from("subscriptions")
    .select("*, prices(*, products(*))")
    .in("status", ["trialing", "active"]);

    // const { subscriptions, error } = await supabase.from("subscriptions").select("*").eq("user_id", sbId);

  if (error) {
    if (error.code === "PGRST301") {
      return new Response("expired", { status: 403 });
    }
    return new Response(error.code, { status: 500 });
  }

  return new Response(JSON.stringify(subscriptions), {});
}
