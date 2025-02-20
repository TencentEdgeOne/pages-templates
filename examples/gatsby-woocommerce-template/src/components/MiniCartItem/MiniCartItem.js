import React from 'react';

import { navigate } from 'gatsby';
import AdjustItem from '../AdjustItem';
import RemoveItem from '../RemoveItem';

import * as styles from './MiniCartItem.module.css';
import { capitalizeFirstLetter } from '../../utils';
import { removeFromCart } from '../../api/api';
import { useContext } from 'react';
import CartContext from '../../context/CartProvider';

const MiniCartItem = (props) => {
  const { image, alt, name, price, quantity, cartItem } = props;
  const { updateCartData } = useContext(CartContext);

  const removeItemFromCart = async (key) => {
    const res = await removeFromCart(key);
    updateCartData();
  }
  return (
    <div className={styles.root}>
      <div
        className={styles.imageContainer}
        role={'presentation'}
        onClick={() => navigate( `/product/${cartItem.product.node.slug}`)}
      >
        <img src={image} alt={alt} />
      </div>
      <div className={styles.detailsContainer}>
        <div className={styles.metaContainer}>
          <span className={styles.name}>{name}</span>
          <div className={styles.priceContainer}>
            <span>{price}</span>
          </div>
          {
            cartItem.extraData && cartItem.extraData.map((data) => (
              <span className={styles.meta}>
                {capitalizeFirstLetter(data.key)}:
                <span className={styles.size}>{data.value}</span>
              </span> ))
          }
        </div>
        <div className={styles.adjustItemContainer}>
          <AdjustItem value={quantity} onChange={props.onQuantityChange}/>
        </div>
      </div>
      <div className={styles.closeContainer}>
        <RemoveItem onClick={() => removeItemFromCart(cartItem.key)}/>
      </div>
    </div>
  );
};

export default MiniCartItem;
