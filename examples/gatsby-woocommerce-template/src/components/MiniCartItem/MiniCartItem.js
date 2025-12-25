import React, { useState } from 'react';

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
  const [removing, setRemoving] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState('');

  const removeItemFromCart = async (key) => {
    if (removing) return;
    setRemoving(true);
    setStatus('');
    try {
      await removeFromCart(key);
      await updateCartData();
      setStatus('Removed');
      setUpdating(false);
      setTimeout(() => setStatus(''), 1500);
    } catch (e) {
      setStatus(e?.message || 'Failed to remove');
    } finally {
      setRemoving(false);
    }
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
          <AdjustItem value={quantity} onChange={async (val) => {
            try {
              setUpdating(true);
              await props.onQuantityChange(val);
              setStatus('更新中...');
            } finally {
              setUpdating(false);
              setTimeout(() => setStatus(''), 800);
            }
          }} disabled={updating || removing}/>
          {updating && <span style={{ fontSize: 12, color: '#666', marginLeft: 8 }}>Updating…</span>}
        </div>
      </div>
      <div className={styles.closeContainer}>
        <RemoveItem loading={removing} onClick={() => removeItemFromCart(cartItem.key)}/>
        {status && (
          <div style={{ color: status === 'Removed' ? '#1f8a3d' : '#666', fontSize: 12, marginTop: 4 }}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniCartItem;
