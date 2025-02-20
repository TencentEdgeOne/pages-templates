import React from 'react';
import * as styles from './AttrOption.module.css';

const AttrOption = (props) => {
  const { data, setActive, isActive } = props;
  return (
    <div
      className={`${styles.root} ${isActive === true ? styles.isActive : ''}`}
      onClick={() => setActive(data)}
      role={'presentation'}
    >
      <span className={styles.option}>{data}</span>
    </div>
  );
};

export default AttrOption;
