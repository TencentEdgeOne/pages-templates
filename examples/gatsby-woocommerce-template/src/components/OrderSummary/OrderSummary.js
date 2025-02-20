import React, { useState } from 'react';
import { Link, navigate } from 'gatsby';

import Button from '../Button';
import * as styles from './OrderSummary.module.css';
import { checkout, checkoutNoAccount } from '../../api/api';
import { isLoggedIn } from '../../utils';

const OrderSummary = (props) => {
  const { cart, customer } = props;
  return (
    <div className={styles.root}>
      <div className={styles.orderSummary}>
        <span className={styles.title}>order summary</span>
        <div className={styles.calculationContainer}>
          <div className={styles.labelContainer}>
            <span>Subtotal</span>
            <span>
              {cart?.subtotal ?? '-'}
            </span>
          </div>
          <div className={styles.labelContainer}>
            <span>Shipping</span>
            <span>{cart?.shippingTotal ?? '-'}</span>
          </div>
          <div className={styles.labelContainer}>
            <span>Tax</span>
            <span>
              {cart?.totalTax ?? '-'}
            </span>
          </div>
        </div>
        <div className={styles.totalContainer}>
          <span>Total: </span>
          <span>
            {cart?.total ?? '-'}
          </span>
        </div>
      </div>
      <div className={styles.actionContainer}>
        <Button
          onClick={async () => {
            if (isLoggedIn()) {
              await checkout({
                shipping: customer.shipping,
                billing: customer.billing,
                paymentMethod: 'cod',
              });
              navigate('/orderConfirm');
            } else {
              // navigate('/login');
              await checkoutNoAccount({
                  shipping: customer.shipping,
                  billing: customer.billing,
                  paymentMethod: 'cod',
                });
              navigate('/orderConfirm');
            }
            
          }}
          fullWidth
          level={'primary'}
        >
          checkout
        </Button>
        <div className={styles.linkContainer}>
          <Link to={'/shop'}>CONTINUE SHOPPING</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
