import React, { useState } from 'react';
import { navigate } from 'gatsby';

import Icon from '../Icons/Icon';
import * as styles from './OrderItem.module.css';
import moment from 'moment';

const OrderItem = (props) => {
  const { headerStyling, order } = props;
  const items = order.lineItems?.nodes ?? [];
  const [collapsed, setCollapsed] = useState(false);

  let computedTotal = 0;
  for (let x = 0; x < items.length; x++) {
    computedTotal =
      computedTotal + items[x].price * items[x].quantity;
  }

  const pad = (str, max) => {
    str = str.toString();
    return str.length < max ? pad('0' + str, max) : str;
  };

  return (
    <div
      className={`${styles.root} ${
        collapsed === true ? styles.paddingBottom : ''
      }`}
    >
      <div
        className={`${headerStyling} ${styles.orderHeader}`}
        role={'presentation'}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className={styles.orderMeta}>
          <span className={styles.orderId}>Order #{pad(order.id, 5)}</span>
          <span
            className={styles.orderTotalMeta}
          >{`${items.length} products totaling `}</span>
          <span className={styles.total}>
            {order?.total ?? '-'}
          </span>
        </div>
        <div className={styles.od}>
          <span className={styles.mobileLabel}>Order Date</span>
          <span className={styles.orderDate}>{moment(order.date).format('lll')}</span>
        </div>
        <span className={styles.lastUpdate}>{moment(order.date).format('lll')}</span>
        <div className={styles.st}>
          <span className={styles.mobileLabel}>Status</span>
          <span className={styles.status}>{order.status}</span>
        </div>
        <div
          className={`${styles.toggleContainer} ${
            collapsed === true ? styles.rotate : ''
          }`}
        >
          <Icon symbol={'caret'} />
        </div>
      </div>
      <div
        className={`${styles.detailsContainer} ${
          collapsed === false ? styles.hide : styles.show
        }`}
      >
        <div className={styles.addressDetailContainer}>
          {order.shipping?.firstName && <div className={styles.addressContainer}>
            <span className={styles.addressMeta}>Ship to</span>
            <span className={styles.address}>
              {`${order.shipping?.firstName} ${order.shipping?.lastName}`}
            </span>
            <span className={styles.address}>
              {order.shipping?.address1}
              {order.shipping?.address2}
            </span>
            <span
              className={styles.address}
            >{`${order.shipping?.state} ${order.shipping?.postcode}`}</span>
            <span className={styles.address}>
              {order.shipping?.country}
            </span>
          </div>}
          {order.billing?.firstName && <div className={styles.addressContainer}>
            <span className={styles.addressMeta}>Bill to</span>
            <span className={styles.address}>{`${order.billing?.firstName} ${order.billing?.lastName}`}</span>
            <span className={styles.address}>
              {order.billing?.address1}
              {order.billing?.address2}
            </span>
            <span
              className={styles.address}
            >{`${order.billing?.state} ${order.billing?.postal}`}</span>
            <span className={styles.address}>
              {order.billing?.country}
            </span>
          </div>}
        </div>

        <div className={styles.itemList}>
          {items.map((item, index) => {
            return (
              <div className={styles.itemContainer} key={index}>
                <div
                  role={'presentation'}
                  onClick={() => navigate(`/product/${item.product?.node?.slug}`)}
                  className={styles.imageContainer}
                >
                  <img alt={item.alt} src={item.product?.node?.image.sourceUrl}></img>
                </div>
                <div>
                  <span className={styles.itemName}>{item.product?.node?.name}</span>
                  <div className={styles.orderItemMeta}>
                    <span className={styles.itemQuantity}>
                      Qty: {item.quantity}
                    </span>
                    <div className={styles.itemTotalMobile}>
                      {item.total}
                    </div>
                  </div>
                </div>
                <div className={styles.itemTotal}>
                  {item.total}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.transactionDetails}>
          <div className={styles.transactionalGrid}>
            <span>Subtotal:</span>
            <span>
              {order?.subtotal ?? '-'}
            </span>
            <span>GST: </span>
            <span>
              {order?.totalTax ?? '-'}
            </span>
            <span className={styles.bold}>Grand Total </span>
            <span className={styles.grandTotal}>
              {order?.total ?? '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;
