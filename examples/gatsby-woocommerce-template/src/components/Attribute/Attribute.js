import React from 'react';

import Icon from '../Icons/Icon';
import * as styles from './Attribute.module.css';

const Attribute = (props) => {
  const { icon, title, subtitle } = props;

  return (
    <div className={styles.root}>
      <div className={styles.iconContainer}>
        <Icon symbol={icon}></Icon>
      </div>
      <span className={styles.title}>{title}</span>
      <span className={styles.subtitle}>{subtitle}</span>
    </div>
  );
};

export default Attribute;
