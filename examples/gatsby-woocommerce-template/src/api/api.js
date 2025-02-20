import { API_BASE_URL } from "../baseUrl";

export async function request(api, params = {}, method = 'GET') {
  const res = await fetch(`${API_BASE_URL}/${api}`, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: method === "POST" ? JSON.stringify(params) : null
  });
  const resJSON = await res.json();
  if (resJSON.code === 0 || resJSON.status === 200) {
    return resJSON.data;
  } else {
    throw new Error(resJSON.message);
  }
}
export async function fetchCartData() {
  return await request(`cart/get-cart`);
  
}

export async function removeFromCart(key) {
  return await request(`cart/remove-items-from-cart`, {
    keys: [key]
  }, 'POST');
}


export async function addToCart(productId, qty, attributes, variationId) {
  const extraData = {};
  attributes && attributes.forEach(attr => {
    extraData[attr.attributeName] = attr.attributeValue;
  });
  return await request(`cart/add-to-cart`, {
    "productId": productId,
    "quantity": qty,
    "variation": attributes,
    "variationId": variationId,
    "extraData": JSON.stringify(extraData)
  }, 'POST');
 
}

export async function updateCartItemQuantities(key, qty) {
  return await request(`cart/update-cart-item-quantities`, {
    "items": [
      {
        "key": key,
        "quantity": qty
      }
    ]
  }, 'POST');
}

export async function checkout(params) {
  return await request(`cart/checkout`, params, 'POST');
}

export async function checkoutNoAccount(params) {
  return await request(`cart/checkout-no-account`, params, 'POST');
}

export async function createOrder(lineItems) {
  return await request(`cart/create-order`, {
    customerNote: 'test',
    lineItems
  }, 'POST');
}

export async function updateCustomer(customer) {
  return await request(`cart/update-customer`, { customer }, 'POST');
}