import { Link } from 'gatsby';
import React from 'react';

import Brand from '../components/Brand';
import CartItem from '../components/CartItem';
import Container from '../components/Container';
import Footer from '../components/Footer';
import Icon from '../components/Icons/Icon';
import OrderSummary from '../components/OrderSummary';

import * as styles from './cart.module.css';
import { isLoggedIn } from '../utils';
import { useContext } from 'react';
import CartContext from '../context/CartProvider';
import { useEffect } from 'react';
import { updateCartItemQuantities } from '../api/api';

const CartPage = (props) => {
  const { state, updateCartData } = useContext(CartContext);
  const { cart, customer } = state ?? {};
  const cartItems = cart?.contents?.nodes ?? [];

  useEffect(() => {
    updateCartData();
  }, []);

  return (
    <div>
      <div className={styles.contentContainer}>
        <Container size={'large'} spacing={'min'}>
          <div className={styles.headerContainer}>
            <div className={styles.shoppingContainer}>
              <Link className={styles.shopLink} to={'/shop'}>
                <Icon symbol={'arrow'}></Icon>
                <span className={styles.continueShopping}>
                  Continue Shopping
                </span>
              </Link>
            </div>
            <Brand />
            {!isLoggedIn() && <div className={styles.loginContainer}>
              <Link to={'/login'}>Login</Link>
            </div>}
          </div>
          <div className={styles.summaryContainer}>
            <h3>My Bag</h3>
            <div className={styles.cartContainer}>
              <div className={styles.cartItemsContainer}>
                {
                  cartItems.map((cartItem) => {
                    const product = cartItem.product.node;
                    const { quantity } = cartItem;

                    return (<CartItem image={product.image.sourceUrl}
                      alt={product.image.altText}
                      name={product.name}
                      price={cartItem.variation ? cartItem.variation.node.price : product.price}
                      quantity={quantity}
                      cartItem={cartItem} 
                      onQuantityChange={async (value) => {
                        const res = await updateCartItemQuantities(cartItem.key, value);
                        await updateCartData(res);
                      }}
                      />)
                  })
                }
              </div>
              <OrderSummary cart={cart} customer={customer}/>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
