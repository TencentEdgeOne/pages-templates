import React from 'react';

import * as styles from './Container.module.css';

const Container = ({ children, size, spacing, fullMobile }) => {
  return (
    <div
      className={`
      ${styles.container} 
      ${size ? styles[size] : ''} ${size ? styles[spacing] : ''}
      ${fullMobile === true ? styles.fullMobile : ''}
      `}
    >
      {children}
    </div>
  );
};

export default Container;
