import React, { useContext, useEffect } from 'react';
import * as styles from './orders.module.css';

import AccountLayout from '../../components/AccountLayout/AccountLayout';
import Breadcrumbs from '../../components/Breadcrumbs';
import Layout from '../../components/Layout/Layout';
import OrderItem from '../../components/OrderItem/OrderItem';
import { isLoggedIn } from '../../utils';
import { navigate } from 'gatsby';
import CartContext from '../../context/CartProvider';

const OrderPage = (props) => {
  const { state } = useContext(CartContext);

  if (isLoggedIn() === false) {
    navigate('/login');
  }

  return (
    <Layout>
      <AccountLayout>
        <Breadcrumbs
          crumbs={[
            { link: '/', label: 'Home' },
            { link: '/account', label: 'Account' },
            { link: '/account/orders/', label: 'Orders' },
          ]}
        />
        <h1>Orders</h1>
        <div className={`${styles.tableHeaderContainer} ${styles.gridStyle}`}>
          <span className={styles.tableHeader}>Order #</span>
          <span className={styles.tableHeader}>Order Placed</span>
          <span className={styles.tableHeader}>Last Update</span>
          <span className={styles.tableHeader}>Status</span>
        </div>
        {
          state?.customer?.orders?.nodes?.map(order => (<OrderItem key={order.id} order={order} headerStyling={styles.gridStyle} />))
        }
        {/* <OrderItem order={sampleOrder1} headerStyling={styles.gridStyle} />
        <OrderItem order={sampleOrder2} headerStyling={styles.gridStyle} /> */}
      </AccountLayout>
    </Layout>
  );
};

export default OrderPage;
