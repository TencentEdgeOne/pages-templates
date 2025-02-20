import React, { useEffect } from 'react';
import { navigate } from 'gatsby';

const OrderIndexPage = (props) => {
  useEffect(() => {
    navigate('/account/orders/');
  }, []);

  return <React.Fragment />;
};

export default OrderIndexPage;
