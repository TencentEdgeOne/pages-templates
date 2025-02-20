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
                      const res = await addToCart(product.productId, qty, attributes, variation?.databaseId);

                      await updateCartData();
                      const cartInfo = res.data.addToCart;
                      showNotification(cartInfo);
                      
                    }}
                    fullWidth
                    level={'primary'}
                  >
                    Add to Bag
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

