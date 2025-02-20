import React, { useState, useEffect } from 'react';
import * as styles from './category.module.css';

import Banner from '../components/Banner';
import Breadcrumbs from '../components/Breadcrumbs';
import Container from '../components/Container';
import Layout from '../components/Layout';

import Button from '../components/Button';
import ProductCardGrid from '../components/ProductCardGrid';

const ShopPage = ({ pageContext }) => {
  const { data } = pageContext;
  const products = data.products.nodes;

  const [loadedPageNum, setLoadedPageNum] = useState(1);
  const [currentProducts, setCurrentProducts] = useState(products.slice(0, 6));
  

  return (
    <Layout>
      <div className={styles.root}>
        <Container size={'large'} spacing={'min'}>
          <div className={styles.breadcrumbContainer}>
            <Breadcrumbs
              crumbs={[
                { link: '/', label: 'Home' },
                { link: `/${data.parent.node.slug}`, label: data.parent.node.name },
                { label: data.name },
              ]}
            />
          </div>
        </Container>
        <Banner
          maxWidth={'650px'}
          name={data.name}
          subtitle={
            data.description
          }
        />
        {data.count ? <Container size={'large'} spacing={'min'}>
          <div className={styles.productContainer}>
            <span className={styles.mobileItemCount}>{data.count} items</span>
            <ProductCardGrid data={products}></ProductCardGrid>
          </div>
          <div className={styles.loadMoreContainer}>
            <span>{Math.min(data.count, 6)} of {data.count}</span>
            {data.count > 6 && currentProducts.length !== products.length && <Button fullWidth level={'secondary'} onClick={() => {
              const newProducts = products.slice(loadedPageNum * 6, (loadedPageNum + 1) * 6);
              setLoadedPageNum(loadedPageNum + 1);
              setCurrentProducts(currentProducts.concat(newProducts));
            }}>
              LOAD MORE
            </Button>}
          </div>
        </Container> : <div className={styles.loadMoreContainer}>No items available</div>}
      </div>

    </Layout>
  );
};

export default ShopPage;

