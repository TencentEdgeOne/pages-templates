import React from 'react';
import * as styles from './Hero.module.css';
import Button from '../Button';
import { Link } from 'gatsby';
import { getImage } from 'gatsby-plugin-image';

const Hero = (props) => {
  const {
    title,
    subtitle,
    ctaText,
    ctaAction,
    image,
    maxWidth,
    ctaStyle,
    ctaLink,
    ctaTo,
    header,
  } = props;
  let backgroundImageSrc;
  if (typeof image === 'string') {
    backgroundImageSrc = image;
  } else if (image.localFile && image.localFile.childImageSharp) {
    const imageData = getImage(image.localFile.childImageSharp?.gatsbyImageData)
    backgroundImageSrc = imageData?.images.fallback.src
  } else {
    backgroundImageSrc = image.sourceUrl;
  }
  
  return (
    <div className={styles.root} style={{ backgroundImage: `url(${backgroundImageSrc})`,backgroundPosition: 'center' }}>
      <div className={styles.content} style={{ maxWidth: maxWidth }}>
        {header && <span className={styles.header}>{header}</span>}
        {title && <h2 className={styles.title}>{title}</h2>}
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        {ctaText && (
          <Button
            className={`${styles.ctaButton} ${ctaStyle}`}
            level={'primary'}
            onClick={ctaAction}
          >
            {ctaText}
          </Button>
        )}
        {ctaLink && (
          <Link className={styles.ctaLink} to={ctaTo}>
            {ctaLink}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Hero;
