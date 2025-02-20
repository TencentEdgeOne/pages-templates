import React from 'react';
import * as styles from './Quote.module.css';

const Quote = (props) => {
  const { bgColor, title, quote } = props;
  return (
    <div className={styles.root} style={{ backgroundColor: bgColor }}>
      <span>{title}</span>
      <p>{quote}</p>
    </div>
  );
};

export default Quote;
