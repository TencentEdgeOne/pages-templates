import { Link, navigate } from 'gatsby';
import React, { useContext } from 'react';
import * as styles from './AccountNav.module.css';
import CartContext from '../../context/CartProvider';
import { request } from '../../api/api';

const AccountNav = (props) => {
  const { updateCartData } = useContext(CartContext);
  const handleLogout = async () => {
    await request(`customers/logout`, {}, 'POST');
    window.localStorage.removeItem('auth-token');
    // update cart data
    updateCartData();
    navigate('/');
  };

  return (
    <div className={styles.root}>
      <div className={styles.webRoot}>
        <Link
          activeClassName={styles.activeLink}
          to={'/account/orders/'}
          className={styles.webLink}
        >
          Orders
        </Link>
        {/* <Link
          activeClassName={styles.activeLink}
          to={'/account/address/'}
          className={styles.webLink}
        >
          Addresses
        </Link> */}
        <Link
          activeClassName={styles.activeLink}
          to={'/account/settings/'}
          className={styles.webLink}
        >
          Settings
        </Link>
        {/* <Link
          activeClassName={styles.activeLink}
          to={'/account/viewed/'}
          className={styles.webLink}
        >
          Recently Viewed
        </Link> */}
        <span
          role={'presentation'}
          onClick={handleLogout}
          className={styles.webLink}
        >
          Logout
        </span>
      </div>
    </div>
  );
};

export default AccountNav;
