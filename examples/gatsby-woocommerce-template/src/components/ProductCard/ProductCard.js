import React, { useState } from 'react';
import { navigate } from 'gatsby';
import * as styles from './ProductCard.module.css';

import Icon from '../Icons/Icon';
import OptimizedImage from '../Image';

const ProductCard = (props) => {
  const {
    image,
    name,
    price,
    regularPrice,
    meta,
    showQuickView,
    slug
  } = props;
  const handleRouteToProduct = () => {
    navigate(`/product/${slug}`);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    showQuickView();
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.imageContainer}
        onClick={() => handleRouteToProduct()}
        role={'presentation'}
      >
        <OptimizedImage image={image}/>
        <div
          className={styles.bagContainer}
          role={'presentation'}
          onClick={(e) => {
            handleQuickView(e);
          }}
        >
          <Icon symbol={'bagPlus'} />
        </div>
      </div>
      <div className={styles.detailsContainer}>
        <span className={styles.productName}>{name}</span>
        <div className={styles.prices}>
          <span
            className={`${regularPrice !== undefined ? styles.salePrice : ''}`}
          >
            <span>{price}</span>
          </span>
          {regularPrice && (
            <span className={styles.regularPrice}>
              <span style={{ 'textDecoration': 'line-through'}}>{regularPrice}</span>
            </span>
          )}
        </div>
        <span className={styles.meta}>{meta}</span>
      </div>
    </div>
  );
};

export default ProductCard;
