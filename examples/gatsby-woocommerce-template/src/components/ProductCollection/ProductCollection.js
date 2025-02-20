import { navigate } from 'gatsby';
import React from 'react';
import * as styles from './ProductCollection.module.css';

import { getImage } from 'gatsby-plugin-image';

const ProductCollection = (props) => {
  const { image, title, text, link } = props;
  const imageData = getImage(image.localFile?.childImageSharp?.gatsbyImageData)
  const backgroundImageSrc = imageData?.images.fallback.src
  return (
    <div
      role={'presentation'}
      onClick={() => navigate(link)}
      className={styles.root}
      style={{ backgroundImage: `url(${backgroundImageSrc})` }}
    >
      <div className={styles.content}>
        <span className={styles.title}>{title}</span>
        <span className={styles.text}>{text}</span>
      </div>
      <div className={styles.overlay}></div>
    </div>
  );
};

export default ProductCollection;
