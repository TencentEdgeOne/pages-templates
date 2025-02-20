import React from 'react';
import Icon from '../Icons/Icon';
import * as styles from './Dropdown.module.css';

const Dropdown = (props) => {
  const { label, optionList } = props;

  return (
    <div className={styles.root}>
      <span className={styles.label}>{label}</span>
      <div className={styles.selectContainer}>
        <select>
          {optionList.map((option) => (
            <option
              key={option.label}
              value={option.value}
              aria-label={`option ${label}`}
              label={option.label}
            />
          ))}
        </select>
        <div className={styles.caretContainer}>
          <Icon symbol={'caret'}></Icon>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
