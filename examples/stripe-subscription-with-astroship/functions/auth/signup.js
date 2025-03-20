import { createSupabaseClient } from "../libs/supabase";
import {
  createOrRetrieveCustomer,
  createSupabaseAdminClient,
} from "../libs/supabase-admin";

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
  let customer;
  try {
    createSupabaseAdminClient(env);
    customer = await createOrRetrieveCustomer({
      uuid: error ? "" : data.user.id,
      email: email,
      env,
    }).catch((err) => {
      return new Response(JSON.stringify(err), { status: 500 });
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify(err), { status: 500 });
  }

  return new Response(null, { status: 200 });
}
