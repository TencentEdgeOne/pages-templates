import React from 'react';
import * as styles from './Checkbox.module.css';

const Checkbox = (props) => {
  const { value, label, id, name, action, isChecked, size = 'md' } = props;
  return (
    <div className={styles.checkboxWrapper}>
      <div className={styles.inputWrapper}>
        <input
          type="checkbox"
          className={styles.input}
          id={id}
          value={value}
          name={name}
          data-label={label}
          onChange={(e) => action(e)}
          checked={isChecked}
        />
        <span
          className={`${styles.box} ${styles[size]}`}
          role="presentation"
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <span className={styles.innerBox}></span>
        </span>
      </div>
      <label className={styles.label} forhtml={id}>
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
