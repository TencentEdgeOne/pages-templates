import React, { useState, useContext, useMemo } from 'react';
import * as styles from './product.module.css';

import Accordion from '../components/Accordion';
import AdjustItem from '../components/AdjustItem';
import Button from '../components/Button';
import Breadcrumbs from '../components/Breadcrumbs';
import Container from '../components/Container';
import AttributeList from '../components/AttributeList';
import Layout from '../components/Layout/Layout';
import AddItemNotificationContext from '../context/AddItemNotificationProvider';
import { addToCart } from '../api/api';
import CartContext from '../context/CartProvider';
import { useEffect } from 'react';
import OptimizedImage from '../components/Image';
const ProductPage = ({ pageContext }) => {
  const ctxAddItemNotification = useContext(AddItemNotificationContext);
  const showNotification = ctxAddItemNotification.showNotification;
  const [qty, setQty] = useState(1);
  const { updateCartData } = useContext(CartContext);  
  const [adding, setAdding] = useState(false);
  const [errorToast, setErrorToast] = useState('');

  const formatError = (err) => {
    const raw = (err && err.message) ? err.message : String(err || 'Failed to add to cart');
    const clean = raw.replace(/\s+/g, ' ').trim();
    return clean.length > 160 ? `${clean.slice(0, 160)}...` : clean;
  };

  const product = pageContext.data;
  const variations = product.variations?.nodes;
  const [variation, setVariation] = useState(null);

  const initAttrs = product.attributes?.nodes.map(node => {
    return {
      attributeName: node.name.toLowerCase(),
      attributeValue: node.options[0],
    };
  });
  const [attributes, setAttributes] = useState(initAttrs);
  useEffect(() => {
    handeAttributeChange(initAttrs);
  }, [])
  const handeAttributeChange = (newAttrs) => {
    setAttributes(newAttrs);
    // decide price and variationId accoording to selected attributes
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
  const crumbs = useMemo(() => {
    const productCategory = product.productCategories.nodes[0];
    const productCategoryParent = productCategory.parent?.node;
    const crumbs = [
      { link: '/', label: 'Home' }
    ];
    if (productCategoryParent) {
      crumbs.push({ link: `/shop`, label: productCategoryParent.name });
    }
    crumbs.push({ link: `/category/${productCategory.slug}`, label: productCategory.name });
    crumbs.push({ label: `${product.name}` });
    return crumbs;
  }, [product]);
 
  return (
    <Layout>
      {errorToast && (
        <div style={{
          position: 'fixed', top: 20, right: 20, background: '#fff', color: '#c00',
          padding: '12px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: 6,
          border: '1px solid #f2c8c8', zIndex: 1000, maxWidth: 360, wordBreak: 'break-word'
        }}>
          {errorToast}
        </div>
      )}
      <div className={styles.root}>
        <Container size={'large'} spacing={'min'}>
          <Breadcrumbs
            crumbs={crumbs}
          />
          <div className={styles.content}>
            <div className={styles.gallery}>
              {/* <img src={product.image.sourceUrl}/> */}
              <OptimizedImage image={product.image}/>
            </div>
            <div className={styles.details}>
              <h1>{product.name}</h1>

              <div className={styles.priceContainer}>
                <span>{variation?variation.price : product.price}</span>
              </div>

              {
                product.attributes?.nodes.map(node => {
                  return <div 
                    key={node.name}
                    className={styles.sizeContainer}>
                    <AttributeList
                      label={node.name}
                      attributeList={node.options}
                      activeAttribute={attributes.find(attr => attr.attributeName.toLowerCase() === node.name.toLowerCase()).attributeValue}
                      setActiveAttribute={(value) => {
                        const newAttrs = JSON.parse(JSON.stringify(attributes));
                        newAttrs.find(attr => attr.attributeName.toLowerCase() === node.name.toLowerCase()).attributeValue = value;
                        handeAttributeChange(newAttrs);
                      }}
                    />
                  </div>
                })
              }
             

              <div className={styles.quantityContainer}>
                <span>Quantity</span>
                <AdjustItem qty={qty} setQty={setQty} />
              </div>

              <div className={styles.actionContainer}>
                <div className={styles.addToButtonContainer}>
                  <Button
                    onClick={async () => {
                      if (adding) return;
                      setAdding(true);
                      try {
                        const res = await addToCart(product.productId, qty, attributes, variation?.databaseId);
                        await updateCartData();
                        const cartInfo = res.data.addToCart;
                        showNotification(cartInfo);
                        setErrorToast('');
                      } catch (e) {
                        const msg = formatError(e);
                        setErrorToast(msg);
                        setTimeout(() => setErrorToast(''), 2500);
                      } finally {
                        setAdding(false);
                      }
                    }}
                    disabled={adding}
                    fullWidth
                    level={'primary'}
                  >
                    {adding ? 'Adding...' : 'Add to Bag'}
                  </Button>
                </div>
              </div>

              <div className={styles.description}>
                <p dangerouslySetInnerHTML={{ __html:product.content }}></p>
              </div>

              <div className={styles.informationContainer}>
                <Accordion
                  type={'plus'}
                  customStyle={styles}
                  title={'delivery & returns'}
                >
                  <p className={styles.information}>
                    Returns accepted within 14 days of delivery. Items must be unused and in original packaging. Shipping fees are non-refundable.
                  </p>
                </Accordion>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default ProductPage;

