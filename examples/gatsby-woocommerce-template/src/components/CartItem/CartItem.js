import React, { useState } from 'react';

import AdjustItem from '../AdjustItem';
import RemoveItem from '../RemoveItem';

import * as styles from './CartItem.module.css';
import { navigate } from 'gatsby';
import { capitalizeFirstLetter } from '../../utils';
import { removeFromCart } from '../../api/api';
import { useContext } from 'react';
import CartContext from '../../context/CartProvider';

const CartItem = (props) => {
  const { updateCartData } = useContext(CartContext);

  const { image, alt, name, price, cartItem, quantity } = props;
  const removeItemFromCart = async (key) => {
    await removeFromCart(key);
    updateCartData();
  }
  return (
    <div className={styles.root}>
      <div
        className={styles.imageContainer}
        role={'presentation'}
        onClick={() => navigate('/product/sample')}
      >
        <img src={image} alt={alt}></img>
      </div>
      <div className={styles.itemContainer}>
        <span className={styles.name}>{name}</span>
        <div className={styles.metaContainer}>
          {
            cartItem.extraData && cartItem.extraData.map((data) => (
              <span> {capitalizeFirstLetter(data.key)}: {data.value}</span>
            ))
          }
        </div>
       
      </div>
      <div className={styles.adjustItemContainer}>
        <AdjustItem value={quantity} onChange={props.onQuantityChange} />
      </div>
      <div className={styles.priceContainer}>
        <span>{price}</span>
      </div>
      <div className={styles.removeContainer}>
        <RemoveItem onClick={() => removeItemFromCart(cartItem.key)} />
      </div>
      
    </div>
  );
};

export default CartItem;
