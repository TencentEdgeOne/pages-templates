import { rawRequest } from 'graphql-request';
import { RegisterDocument } from './queries/Register';
import { LoginDocument } from './queries/Login';
import { AddToCart } from './queries/AddToCart';
import { GetCart } from './queries/Queries';
import { RemoveItemsFromCart } from './queries/RemoveFromCart';
import { UpdateCartItemQuantities } from './queries/UpdateCartItemQuantities';
import { Checkout } from './queries/Checkout';
import {CheckoutNoAccount} from './queries/CheckoutNoAccount';
import { CreateOrder } from './queries/CreateOrder';
import { RefreshToken } from './queries/RefreshToken';
import { UpdateCustomer } from './queries/UpdateCustomer';


const graphqls = {
  'refresh-auth-token': RefreshToken,
  'login': LoginDocument,
  'register': RegisterDocument,
  'add-to-cart': AddToCart,
  'get-cart': GetCart,
  'remove-items-from-cart': RemoveItemsFromCart,
  'update-cart-item-quantities': UpdateCartItemQuantities,
  'checkout': Checkout,
  'create-order': CreateOrder,
  'update-customer': UpdateCustomer,
  'checkout-no-account': CheckoutNoAccount
}
// login
export async function login(username: string, password: string, env: any = {}) {
  console.log('login', `${env.WP_URL}/graphql`);
  const headers = {};
  try {
    const res = await rawRequest(
      `${env.WP_URL}/graphql`,
      LoginDocument,
      { username, password, provider: 'PASSWORD', email: username },
      headers,
    );
    console.log('login res', res);
    const { data, headers: responseHeaders, status } = res;
    const loginResults = (data as any)?.login;
    const { authToken, refreshToken, customer } = loginResults;
    const sessionToken = customer.sessionToken;

    if (!authToken || !refreshToken || !sessionToken) {
      throw new Error('Failed to retrieve credentials.');
    }
    return {
      authToken,
      refreshToken,
      sessionToken,
    };
  } catch (error) {
    throw new Error(error);
  }
}
export async function refreshAuthToken(refreshToken: string, env: any = {}) {
  console.log('refreshAuthToken r11es', refreshToken);

  const res = (await rawRequest(
      `${env.WP_URL}/graphql`,
      RefreshToken,
      { refreshToken },
      {},
    ).catch((e) => {
      console.log('refreshAuthToken failed!', e);
      throw e;
    })) as any;
  console.log('refreshAuthToken res', res.data);
  return res.data?.refreshJwtAuthToken;
}
// register
export async function register(username: string, password: string, env: any = {}) {
  console.log('register', `${env.WP_URL}/graphql`);
  const headers = {};
  try {
    console.log('start');
    const res = (await rawRequest(
      `${env.WP_URL}/graphql`,
      RegisterDocument,
      { username, password, email: username },
      headers,
    ).catch((e) => {
      throw e;
    })) as any;
    console.log('res', res);
    const { data, headers: responseHeaders, status } = res;
    const registerCustomer = (data as any)?.registerCustomer;
    const { authToken, refreshToken, customer } = registerCustomer;
    const sessionToken = customer.sessionToken;

    if (!authToken || !refreshToken || !sessionToken) {
      throw new Error('Failed to retrieve credentials.');
    }
    return {
      authToken,
      refreshToken,
      sessionToken,
    };
  } catch (error) {
    throw new Error(error);
  }
}

export async function dispatchGraphql(graphqlKey: string, params: any, authData: { authToken: string, sessionToken: string, refreshToken: string}, env: any = {}, resHeaders?: any) {
  let headers = {};
  const { authToken, sessionToken, refreshToken } = authData;
  // use token to auth user first
  if (authToken) {
    headers = {
      'Authorization': `Bearer ${authToken}`,
    };
  } else if (sessionToken) {
    headers = {
      'woocommerce-session': `Session ${sessionToken}`,
    };
  }

  console.log(
    'dispatchGraphql',
    graphqlKey,
    params,
    typeof params,
    authToken,
    headers,
  );
  
  try {
    let newAuthData = authData;
    const res = (await rawRequest(
      `${env.WP_URL}/graphql`,
      graphqls[graphqlKey],
      params,
      headers,
    ).catch(async (e) => {
      const expiredErr = e.response?.errors?.find(
        (er) => er.debugMessage?.indexOf('Expired token') > -1,
      );
      if (expiredErr) {
        // refresh token
        newAuthData = await refreshAuthToken(refreshToken, env);
        newAuthData = { ...authData, ...newAuthData };
        return (
          await dispatchGraphql(graphqlKey, params, newAuthData, env, resHeaders)
        ).res;
      } else {
        throw e;
      }
    })) as any;
    if (graphqlKey === 'get-cart') {
      // set session token
      newAuthData.sessionToken = res.data.customer.sessionToken;
    }
    console.log('dispatchGraphql res succeed');
    return {res, auth:newAuthData};
  } catch (error) {
    throw new Error(error);
  }
}