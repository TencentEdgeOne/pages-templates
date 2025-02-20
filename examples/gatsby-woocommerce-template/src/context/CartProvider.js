import React, { createContext, useState } from 'react';
import { fetchCartData } from '../api/api';

const defaultState = {
  cart: {}
}
export const CartContext = createContext(defaultState);

export const CartProvider = ({ children }) => {
  const [state, setState] = useState(defaultState);
  const updateCartData = async () => {
    const res = await fetchCartData().catch(e => {
      window.localStorage.removeItem('auth-token');
    });
    setState(res?.data);
  }

  
  return (
    <CartContext.Provider
      value={{
        state,
        setState,
        updateCartData
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;