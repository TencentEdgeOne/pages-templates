import React, { useState } from 'react';
import * as styles from './ProductCardGrid.module.css';

import Drawer from '../Drawer';
import ProductCard from '../ProductCard';
import QuickView from '../QuickView';
import Slider from '../Slider';

const ProductCardGrid = (props) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const { height, columns = 3, data, spacing, showSlider = false } = props;
  const [currentProduct, setCurrentProduct] = useState({});
  const columnCount = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
  };

  const renderCards = () => {
    return data.map((product, index) => {
      return (
        <ProductCard
          slug={product.slug}
          key={index}
          height={height}
          price={product.price}
          imageAlt={product.alt}
          name={product.name}
          image={product.image}
          meta={product.meta}
          regularPrice={product.regularPrice}
          link={product.link}
          showQuickView={() => {
            setCurrentProduct(product);
            setShowQuickView(true);
          }}
        />
      );
    });
  };

  return (
    <div className={styles.root} style={columnCount}>
      <div
        className={`${styles.cardGrid} ${
          showSlider === false ? styles.show : ''
        }`}
        style={columnCount}
      >
        {data && renderCards()}
      </div>

      {showSlider === true && (
        <div className={styles.mobileSlider}>
          <Slider spacing={spacing}>{data && renderCards()}</Slider>
        </div>
      )}

      <Drawer visible={showQuickView} close={() => setShowQuickView(false)}>
        <QuickView close={() => setShowQuickView(false)} product={currentProduct}/>
      </Drawer>
    </div>
  );
};

export default ProductCardGrid;
