import Stripe from 'stripe';
import { FetchHttpClientResponse } from "../../node_modules/stripe/esm/net/FetchHttpClient"
FetchHttpClientResponse._transformHeadersToObject = (headers) => {
  return headers;
}
// polyfill
import { SubtleCryptoProvider } from "../../node_modules/stripe/esm/crypto/SubtleCryptoProvider";
const byteHexMapping = new Array(256);
for (let i = 0; i < byteHexMapping.length; i++) {
  byteHexMapping[i] = i.toString(16).padStart(2, '0');
}
SubtleCryptoProvider.prototype.computeHMACSignatureAsync = async function (payload, secret) {
  const encoder = new TextEncoder();
  let key;
  try {
    key = await crypto.subtle.importKey('raw', encoder.encode(secret), {
      name: 'HMAC',
      hash: 'SHA-256',
      // hash: { name: 'SHA-256' },
    }, false, ['sign']).catch(e => {
      console.log('computeHMACSignatureAsync error', e);
    });
  } catch (e) {
    console.log('computeHMACSignatureAsync error1', e);
  }
  const signatureBuffer = await this.subtleCrypto.sign('hmac', key, encoder.encode(payload));

  // crypto.subtle returns the signature in base64 format. This must be
  // encoded in hex to match the CryptoProvider contract. We map each byte in
  // the buffer to its corresponding hex octet and then combine into a string.
  const signatureBytes = new Uint8Array(signatureBuffer);
  const signatureHexCodes = new Array(signatureBytes.length);
  for (let i = 0; i < signatureBytes.length; i++) {
    signatureHexCodes[i] = byteHexMapping[signatureBytes[i]];
  }
  return signatureHexCodes.join('');
}
export let stripe;

export const createStripe = (env) => {
  if (!stripe) {
    stripe = new Stripe(env.STRIPE_SECRET_KEY)
  }
  return stripe;
}
/**
 * Create a Stripe Customer
 * @param {*} email 
 * @returns 
 */
export const createStripeCustomer = async (email, uuid) => {
  const stripe = createStripe();
  const params = {
    email,
    metadata: {
      supabaseUUID: uuid,
    }
  };

  const customer = await stripe.customers.create(params);

  return customer.id;
};
/**
 * Create a Stripe Portal Session
 * @param {*} customerId 
 */
export const createStripePortalSession = async (customerId) => {
  const stripe = createStripe();

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: 'http://localhost:4321/',
  });
  return session;
}