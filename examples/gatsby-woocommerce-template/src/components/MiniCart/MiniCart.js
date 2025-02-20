import { Link, navigate } from 'gatsby';
import React from 'react';

import Button from '../Button';
import MiniCartItem from '../MiniCartItem';

import * as styles from './MiniCart.module.css';
import { useEffect } from 'react';
import { updateCartItemQuantities } from '../../api/api';
import { useContext } from 'react';
import CartContext from '../../context/CartProvider';

const MiniCart = (props) => {
  const { state, setState, updateCartData } = useContext(CartContext);
  const {cart} = state ?? {};
  const cartItems = cart?.contents?.nodes ?? [];

  useEffect(() => {
    updateCartData();
  }, []);
  return (
    <div className={styles.root}>
      <div className={styles.titleContainer}>
        <h4>My Bag</h4>
      </div>
      <div className={styles.cartItemsContainer}>
        {cartItems.map((cartItem) => {
          const product = cartItem.product.node;
          const { quantity} = cartItem;

          return (
            <MiniCartItem 
              key={cartItem.key}
              image={product.image.sourceUrl}
              alt={product.image.altText}
              name={product.name}
              price={cartItem.variation ? cartItem.variation.node.price : product.price}
              quantity={quantity}
              cartItem={cartItem}
              onQuantityChange={async (value) => {
                const res = await updateCartItemQuantities(cartItem.key, value);
                await updateCartData(res);
              }}
              color 
              size />
          )
        })}
      </div>
      <div className={styles.summaryContainer}>
        <div className={styles.summaryContent}>
          <div className={styles.totalContainer}>
            <span>Total (USD)</span>
            <span>
              
              {cart?.total}
            </span>
          </div>
          <span className={styles.taxNotes}>
            Taxes and shipping will be calculated at checkout
          </span>
          <Button onClick={() => navigate('/cart')} level={'primary'} fullWidth disabled={!cart?.contents?.itemCount}>
            checkout
          </Button>
          <div className={styles.linkContainer}>
            <Link to={'/shop'}>continue shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCart;
