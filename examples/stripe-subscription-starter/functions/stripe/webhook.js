import Stripe from "stripe";
import { createStripe } from "../libs/stripe";
import {
  upsertProduct,
  upsertPrice,
  deleteProduct,
  deletePrice,
  manageSubscriptionStatusChange,
  createSupabaseAdminClient
} from "../libs/supabase-admin";


const relevantEvents = new Set([
  'product.created',
  'product.updated',
  'product.deleted',
  'price.created',
  'price.updated',
  'price.deleted',
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted'
]);

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const stripe = createStripe(env);
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 });
    event = await stripe.webhooks.constructEventAsync(body, sig, webhookSecret, undefined, Stripe.createSubtleCryptoProvider());
    console.log(`🔔  Webhook received: ${event.type}`);
  } catch (err) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  // create client first
  createSupabaseAdminClient(env);
  // insert records
  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'product.created':
        case 'product.updated':
          await upsertProduct(event.data.object);
          break;
        case 'price.created':
        case 'price.updated':
          await upsertPrice(event.data.object);
          break;
        case 'price.deleted':
          await deletePrice(event.data.object);
          break;
        case 'product.deleted':
          await deleteProduct(event.data.object);
          break;
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          const subscription = event.data.object;
          await manageSubscriptionStatusChange(
            subscription.id,
            subscription.customer,
            event.type === 'customer.subscription.created'
          );
          break;
        case 'checkout.session.completed':
          const checkoutSession = event.data.object;
          if (checkoutSession.mode === 'subscription') {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscriptionStatusChange(
              subscriptionId,
              checkoutSession.customer,
              true
            );
          }
          break;
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.log(error);
      return new Response(
        'Webhook handler failed. View your function logs.' + error.message + ';' + sig,
        {
          status: 400
        }
      );
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400
    });
  }
  return new Response(JSON.stringify({ received: true }));
}