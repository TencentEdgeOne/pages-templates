import React from 'react';
import { Link } from 'gatsby';

import * as styles from './Elevator.module.css';

const Elevator = ({ children, to, onClick, isActive, themeRef }) => {
  return (
    <div
      onClick={onClick}
      role={'presentation'}
      className={`${styles.root} ${isActive === true ? styles.active : ''}`}
      ref={themeRef}
    >
      <Link className={`${styles.link}`} to={to}>
        {children}
      </Link>
    </div>
  );
};

export default Elevator;
