import React from 'react';
import * as styles from './Banner.module.css';

const Banner = (props) => {
  const {
    maxWidth,
    name,
    subtitle,
    color,
    bgImage,
    height,
    bgColor = 'var(--standard-light-grey)',
    hideSubtitleOnMobile = true,
  } = props;

  const customStyling = {
    backgroundColor: bgColor,
    backgroundImage: bgImage !== undefined ? `url(${bgImage})` : 'none',
    height: height,
    color: color,
  };

  return (
    <div className={styles.root} style={customStyling}>
      <div className={styles.content} style={{ maxWidth: maxWidth }}>
        <h2>{name}</h2>
        {subtitle && (
          <span
            className={`${styles.subtitle} ${
              hideSubtitleOnMobile === true ? styles.hideSubtitleOnMobile : ''
            }`}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default Banner;
