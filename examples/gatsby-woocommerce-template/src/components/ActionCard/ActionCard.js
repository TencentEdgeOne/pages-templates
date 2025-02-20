import React from 'react';
import { navigate } from 'gatsby';
import * as styles from './ActionCard.module.css';

import Icon from '../Icons/Icon';

const ActionCard = (props) => {
  const { title, icon, subtitle, link, size } = props;
  return (
    <div
      className={styles.root}
      role={'presentation'}
      onClick={() => navigate(link)}
    >
      <div className={`${styles.iconContainer} ${styles[size]}`}>
        <Icon symbol={icon} />
      </div>
      <span className={styles.actionName}>{title}</span>
      <span className={styles.link}>
        {subtitle}
        <Icon symbol={'caret'}></Icon>
      </span>
    </div>
  );
};

export default ActionCard;
