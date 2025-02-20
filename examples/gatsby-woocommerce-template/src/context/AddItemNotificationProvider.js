import React, { createContext, useState, useEffect } from 'react';

const defaultState = {
  open: false,
  cart: {},
};

export const NotificationContext = createContext(defaultState);

export const NotificationProvider = ({ children }) => {
  const [state, setState] = useState(defaultState);

  const showNotification = (cartInfo) => {
    setState({ ...state, open: true, cart: cartInfo } );
  };

  const closeNotification = () => {
    setState({ ...state, open: false });
  };

  useEffect(() => {
    if (state?.open === true) {
      setTimeout(() => {
        closeNotification();
      }, 2000);
    }
  }, [state]);

  return (
    <NotificationContext.Provider
      value={{
        state,
        setState,
        showNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
