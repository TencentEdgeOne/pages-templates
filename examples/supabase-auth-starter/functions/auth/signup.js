import { createSupabaseClient } from "../libs/supabase";

export async function onRequestPost(context) {
  const { request, env } = context;
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { data, error } = await createSupabaseClient(env).auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(error.code, { status: 500 });
  }
 
  return new Response(null, { status: 200 });
}
