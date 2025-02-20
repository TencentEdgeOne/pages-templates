import React from 'react';

import AttrOption from '../AttrOption';
import * as styles from './AttributeList.module.css';
import { capitalizeFirstLetter } from '../../utils';

const AttributeList = (props) => {
  const { label, attributeList, setActiveAttribute, activeAttribute } = props;
  return (
    <div className={styles.root}>
      <div className={styles.sizeLabelContainer}>
        <span className={styles.label}>{capitalizeFirstLetter(label)}</span>
      </div>
      <div className={styles.sizeSelection}>
        {attributeList?.map((option, index) => {
          return (
            <AttrOption
              key={index}
              data={option}
              setActive={setActiveAttribute}
              isActive={activeAttribute === option}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AttributeList;
