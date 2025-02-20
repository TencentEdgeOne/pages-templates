import React, { useState } from 'react';

import Icon from '../Icons/Icon';
import * as styles from './AdjustItem.module.css';

const AdjustItem = (props) => {
  const { isTransparent } = props;
  const [qty, setQty] = useState(props.value ? props.value : 1);

  const handleOnChange = (e) => {
    const num = parseInt(e.target.value);
    props.onChange && props.onChange(num);
    setQty(num);
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
          if (qty <= 1) return;
          setQty(qty - 1);
          props.onChange && props.onChange(qty);
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
        ></input>
      </div>
      <div
        role={'presentation'}
        onClick={() => {
          setQty(qty + 1);
          props.onChange && props.onChange(qty);
        }}
        className={styles.iconContainer}
      >
        <Icon symbol={'plus'}></Icon>
      </div>
    </div>
  );
};

export default AdjustItem;
