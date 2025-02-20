import React, { useState, useEffect } from 'react';
import * as styles from './shop.module.css';
import Container from '../components/Container';
import Layout from '../components/Layout';
import ProductCardGrid from '../components/ProductCardGrid';
import Button from '../components/Button';


const ShopPage = ({pageContext}) => {
  const { data } = pageContext;

  const products = data.nodes;
  const [loadedPageNum, setLoadedPageNum] = useState(1);
  const [currentProducts, setCurrentProducts] = useState(products.slice(0, 6));

  return (
    <Layout>
      <div className={styles.root}>
        <Container size={'large'} spacing={'min'}>
          <div className={styles.productContainer}>
            <span className={styles.mobileItemCount}>{products.length} items</span>
            <ProductCardGrid data={currentProducts}></ProductCardGrid>
          </div>
          <div className={styles.loadMoreContainer}>
            <span>{Math.min(products.length, 6)} of {products.length}</span>
            {products.length > 6 && currentProducts.length !== products.length &&  <Button fullWidth level={'secondary'} onClick={() => {
              const newProducts = products.slice(loadedPageNum * 6, (loadedPageNum + 1) * 6);
              setLoadedPageNum(loadedPageNum + 1);
              setCurrentProducts(currentProducts.concat(newProducts));
            }}>
              LOAD MORE
            </Button>}
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default ShopPage;
