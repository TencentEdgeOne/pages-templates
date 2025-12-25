import React, { useState } from 'react';

import Icon from '../Icons/Icon';
import * as styles from './AdjustItem.module.css';

const AdjustItem = (props) => {
  const { isTransparent, disabled } = props;
  const [qty, setQty] = useState(props.value ? props.value : 1);

  const handleOnChange = (e) => {
    if (disabled) return;
    const num = parseInt(e.target.value, 10) || 0;
    const next = num < 1 ? 1 : num;
    setQty(next);
    props.onChange && props.onChange(next);
  };


  return (
    <div
      className={`${styles.root} ${
        isTransparent === true ? styles.transparent : ''
      }`}
    >
      <div
        className={styles.iconContainer}
        role={'presentation'}
        onClick={() => {
          if (disabled || qty <= 1) return;
          const next = qty - 1;
          setQty(next);
          props.onChange && props.onChange(next);
        }}
      >
        <Icon symbol={'minus'}></Icon>
      </div>
      <div className={styles.inputContainer}>
        <input
          className={`${isTransparent === true ? styles.transparentInput : ''}`}
          onChange={(e) => handleOnChange(e)}
          type={'number'}
          value={qty}
          disabled={disabled}
        ></input>
      </div>
      <div
        role={'presentation'}
        onClick={() => {
          if (disabled) return;
          const next = qty + 1;
          setQty(next);
          props.onChange && props.onChange(next);
        }}
        className={styles.iconContainer}
      >
        <Icon symbol={'plus'}></Icon>
      </div>
    </div>
  );
};

export default AdjustItem;
