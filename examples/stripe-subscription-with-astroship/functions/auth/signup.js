import { createStripe } from "../libs/stripe";
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
    createStripe(env);

    customer = await createOrRetrieveCustomer({
      uuid: error ? "" : data.user.id,
      email: email,
      env,
    }).catch((err) => {
      throw err;
    });
  } catch (err) {
    console.error(err);
    return new Response(err.message, { status: 500 });
  }
  console.log('customer', customer);
  return new Response(null, { status: 200 });
}
