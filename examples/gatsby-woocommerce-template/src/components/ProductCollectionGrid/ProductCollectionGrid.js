import React from 'react';
import * as styles from './ProductCollectionGrid.module.css';

import ProductCollection from '../ProductCollection';
const ProductCollectionGrid = ({ collections }) => {
  return (
    <div className={styles.root}>
      {
        collections.map((collection) => (
          <ProductCollection
            key={collection.slug}
            image={collection.image}
            title={collection.name}
            text={'SHOP NOW'}
            link={`/category/${collection.slug}`}
          />
        ))
      }
    </div>
  );
};

export default ProductCollectionGrid;
