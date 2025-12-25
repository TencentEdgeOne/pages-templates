import React, { useState, useContext } from 'react';

import Button from '../Button';
import AddItemNotificationContext from '../../context/AddItemNotificationProvider';

import * as styles from './QuickView.module.css';
import AttributeList from '../AttributeList';
import { addToCart } from '../../api/api';
import CartContext from '../../context/CartProvider';
import { useEffect } from 'react';
import OptimizedImage from '../Image';

const QuickView = (props) => {
  const { close, buttonTitle = 'Add to Bag', product } = props;
  const { image } = product;

  const ctxAddItemNotification = useContext(AddItemNotificationContext);
  const showNotification = ctxAddItemNotification.showNotification;
  // variations
  const variations = product.variations?.nodes;
  const [variation, setVariation] = useState(null);

  // attributes
  
  const [attributes, setAttributes] = useState(null);
  const { updateCartData } = useContext(CartContext);
  const [adding, setAdding] = useState(false);
  const [errorToast, setErrorToast] = useState('');

  const formatError = (err) => {
    const raw = (err && err.message) ? err.message : String(err || 'Failed to add to cart');
    const clean = raw.replace(/\s+/g, ' ').trim();
    return clean.length > 160 ? `${clean.slice(0, 160)}...` : clean;
  };

  useEffect(() => {
    const initAttrs = product.attributes?.nodes.map(node => {
      return {
        attributeName: node.name.toLowerCase(),
        attributeValue: node.options[0],
      };
    });
    setAttributes(initAttrs);
    handeAttributeChange(initAttrs);
  }, [product])

  const handleAddToBag = async () => {
    if (adding) return;
    setAdding(true);
    try {
      const res = await addToCart(product.productId, 1, attributes, variation?.databaseId);
      await updateCartData();
      const cartInfo = res.data.addToCart;
      close();
      showNotification(cartInfo);
      setErrorToast('');
    } catch (e) {
      const msg = formatError(e);
      setErrorToast(msg);
      setTimeout(() => setErrorToast(''), 2500);
    } finally {
      setAdding(false);
    }
  };
  const handeAttributeChange = (newAttrs) => {
    setAttributes(newAttrs);
    if (variations) {
      const newVariation = variations.find(variation => {
        const matched1 = variation.attributes.nodes.every(attr => {
          const targetAttr = newAttrs.find(attr2 => attr.name.toLowerCase() === attr2.attributeName.toLowerCase());

          return targetAttr.attributeValue === attr.value || !attr.value
        });
        const matched2 = newAttrs.every(attr2 => {
          const targetVar = variation.attributes.nodes.find(attr3 => attr2.attributeName.toLowerCase() === attr3.name.toLowerCase() || !attr3.value);

          return targetVar.value === attr2.attributeValue || !targetVar.value
        });

        return matched1 && matched2;
      })
      setVariation(newVariation);
    }
  }
  return (
    <div className={styles.root}>
      <div className={styles.titleContainer}>
        <h4>Select Options</h4>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.productContainer}>
          <span className={styles.productName}>{product.name}</span>
          <div className={styles.price}>
            <span>{product.price}</span>
          </div>
          <div className={styles.productImageContainer}>
            {image  && <OptimizedImage image={image}/>}
          </div>
        </div>

        {
          product.attributes?.nodes.map(node => {
            return <div className={styles.sizeContainer}>
              <AttributeList
                label={node.name}
                attributeList={node.options}
                activeAttribute={attributes && attributes.find(attr => attr.attributeName.toLowerCase() === node.name.toLowerCase()).attributeValue}
                setActiveAttribute={(value) => {
                  if (!attributes) return;
                  const newAttrs = JSON.parse(JSON.stringify(attributes));
                  newAttrs.find(attr => attr.attributeName.toLowerCase() === node.name.toLowerCase()).attributeValue = value;
                  handeAttributeChange(newAttrs);
                }}
              />
            </div>
          })
        }

        <Button onClick={() => handleAddToBag()} disabled={adding} fullWidth level={'primary'}>
          {adding ? 'Adding...' : buttonTitle}
        </Button>
        {errorToast && (
          <div style={{
            position: 'fixed', top: 20, right: 20, background: '#fff', color: '#c00',
            padding: '12px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 6,
            border: '1px solid #f2c8c8', zIndex: 1000, maxWidth: 360, wordBreak: 'break-word'
          }}>
            {errorToast}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickView;
