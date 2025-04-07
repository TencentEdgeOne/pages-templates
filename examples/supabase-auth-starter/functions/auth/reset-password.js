import { createSupabaseClient } from "../libs/supabase";
import { getURL } from "../libs/utils";

export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();
  const password = formData.get("password")?.toString();
  const access_token = formData.get("access_token")?.toString();
  const refresh_token = formData.get("refresh_token")?.toString();

  if (!password) {
    return new Response("Password are required", { status: 400 });
  }
  console.log("update psswrd access_token", access_token);
  const supabase = createSupabaseClient(env, access_token);
  await supabase.auth.setSession({
    access_token,
    refresh_token
  })
  const { data, error } = await supabase.auth.updateUser({
      password: password
    });

  if (error) {
    console.log("update psswrd error", error);
    return new Response(error.code, { status: 500 });
  }
  console.log("update psswrd res", data);

  return new Response(JSON.stringify(data), {
    status: 200
  });
}
