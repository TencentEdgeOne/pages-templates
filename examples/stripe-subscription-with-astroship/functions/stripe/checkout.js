
import { createStripe } from '../libs/stripe';
import { createSupabaseAdminClient } from '../libs/supabase-admin';
import { getURL } from '../libs/utils';


export async function onRequestGet(context) {
  const { request, env } = context;
  // get plan id
  const { plan, price: priceId } = request.url.split('?').pop().split('&').reduce((prev, cur) => {
    const [key, value] = cur.split('=');
    prev[key] = value;
    return prev;
  }, {});

  const cookies = new Cookies(request.headers.get('cookie'));
  const stripe = createStripe(context.env);
  const sbId = cookies.get("sb-user-id") && cookies.get("sb-user-id").value;

  if (!sbId) {
    const redirectUrl = getURL(env, `stripe/checkout?plan=${plan}&price=${priceId}`);
    return Response.redirect(getURL(env,`login?redirectUrl=${encodeURIComponent(redirectUrl)}`), 302);
  }
  try {
    const supabase = createSupabaseAdminClient(env);
    const stripeCustomer = await supabase.from('customers').select('stripe_customer_id').eq('id', sbId).single();
    const { stripe_customer_id } = stripeCustomer.data;

    const price = await supabase.from('prices').select('*').eq('id', priceId).eq('product_id', plan);

    const params = {
      customer: stripe_customer_id,
      success_url: getURL(env, `/account`),
      cancel_url: getURL(env, '/pricing'),
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ]
    }

    const session = await stripe.checkout.sessions.create(params);
    const { url } = session;

    return Response.redirect(url, 302);
  } catch (err) {
    return new Response(JSON.stringify(err), { status: 500 });
  }

}