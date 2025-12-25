import React from 'react';
import Icon from '../Icons/Icon';
import * as styles from './RemoveItem.module.css';

const RemoveItem = ({ onClick, loading }) => {
  return (
    <div className={styles.root}>
      {loading && (
        <div className={styles.loadingWrap}>
          <span className={styles.spinner} />
          <span className={styles.loadingText}>Removing...</span>
        </div>
      )}
      <div
        className={`${styles.iconBtn} ${loading ? styles.disabled : ''}`}
        onClick={loading ? undefined : onClick}
      >
        <Icon symbol={'cross'} />
      </div>
    </div>
  );
};

export default RemoveItem;
