import React from 'react';

import AccountNav from '../AccountNav';
import Container from '../Container';

import * as styles from './AccountLayout.module.css';

const AccountLayout = ({ children }) => {
  return (
    <div className={styles.root}>
      <Container size={'large'}>
        <div className={styles.layout}>
          <AccountNav />
          <div className={styles.childrenContainer}>{children}</div>
        </div>
      </Container>
    </div>
  );
};

export default AccountLayout;
