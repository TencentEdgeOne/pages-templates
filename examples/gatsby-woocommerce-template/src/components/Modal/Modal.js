import React, { useEffect } from 'react';
import * as styles from './Modal.module.css';

const Modal = ({ children, visible, close }) => {
  useEffect(() => {
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [close]);

  return (
    <div
      className={`${styles.root} ${
        visible === true ? styles.show : styles.hide
      }`}
    >
      <div className={styles.contentContainer}>{children}</div>
      <div
        role={'presentation'}
        onClick={() => close()}
        className={styles.backdrop}
      ></div>
    </div>
  );
};

export default Modal;
