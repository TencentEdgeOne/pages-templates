import { createSupabaseClient } from "../libs/supabase";
import { getURL } from "../libs/utils";

export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();
  const email = formData.get("email")?.toString();

  if (!email) {
    return new Response("Email are required", { status: 400 });
  }

  const { data, error } = await createSupabaseClient(
    env,
  ).auth.resetPasswordForEmail(
    email,
    {
      redirectTo: getURL(env, "/reset-password")
    }
  );

  if (error) {
    return new Response(error.code, { status: 500 });
  }
  console.log("reset psswrd res", data);
  
  return new Response(null, {
    status: 200
  });
}
