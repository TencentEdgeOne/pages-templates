import { Link } from 'gatsby';
import React, { useContext } from 'react';

import AddItemNotificationContext from '../../context/AddItemNotificationProvider';

import Button from '../Button';
import Icon from '../Icons/Icon';

import * as styles from './AddNotification.module.css';

const AddNotification = (props) => {
  const ctxAddItemNotification = useContext(AddItemNotificationContext);
  const showNotif = ctxAddItemNotification.state?.open;
  const cartInfo = ctxAddItemNotification.state?.cart;
  const {cart = {}, cartItem = {}} = cartInfo ?? {};
  const cartProduct = cartItem?.product?.node;
  return (
    <div
      className={`${styles.root} ${
        showNotif === true ? styles.show : styles.hide
      }`}
    >
      <div className={styles.header}>
        <div className={styles.iconContainer}>
          <Icon symbol={'check'}></Icon>
        </div>
        <span>Item added to bag</span>
      </div>

      {cartProduct && <div className={styles.newItemContainer}>
        <div className={styles.imageContainer}>
          <img alt={cartProduct.image.altText} src={cartProduct.image.sourceUrl} />
        </div>
        <div className={styles.detailContainer}>
          <span className={styles.name}>{cartProduct.name}</span>
        </div>
      </div>}

      <div className={styles.actionContainer}>
        <Button onClick={props.openCart} level={'secondary'}>
          view my bag
        </Button>
        <Button level="primary" href="/cart">
          checkout
        </Button>
        <div className={styles.linkContainer}>
          <Link to={'/shop'}>continue shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default AddNotification;
