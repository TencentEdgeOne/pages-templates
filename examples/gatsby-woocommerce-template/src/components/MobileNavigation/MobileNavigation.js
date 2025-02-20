import React, { useState, useEffect } from 'react';
import { Link, navigate } from 'gatsby';

import Config from '../../utils/config.json';
import Icon from '../Icons/Icon';
import { isLoggedIn } from '../../utils';

import * as styles from './MobileNavigation.module.css';

const MobileNavigation = (props) => {
  const { close } = props;

  const [subMenu, setSubMenu] = useState();
  const [category, setCategory] = useState();
  const [depth, setDepth] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn() === true);
  }, [])
  const handleLogout = () => {
    window.localStorage.removeItem('auth-token');
    navigate('/');
    close();
  };


  return (
    <div className={styles.root}>
      <nav>
        <div className={styles.headerAuth}>
          {depth === 0 && !loggedIn && (
            <div className={styles.authLinkContainer}>
              <Link to='/signup'>Sign Up</Link>
              <Link to='/login'>Login</Link>
            </div>
          )}

          {depth === 0 && loggedIn && (
            <div
              className={styles.welcomeContainer}
              role={'presentation'}
              onClick={() => setDepth(-1)}
            >
              <span className={styles.welcomeMessage}>Welcome</span>
              <Icon symbol={'caret'}></Icon>
            </div>
          )}


          {depth === -1 && loggedIn && (
            <div
              className={styles.previousLinkContainer}
              onClick={() => setDepth(0)}
              role={'presentation'}
            >
              <div className={styles.previousIcon}>
                <Icon symbol={'caret'}></Icon>
              </div>
              <span>my account</span>
            </div>
          )}

          {depth === 1 && (
            <div
              className={styles.previousLinkContainer}
              onClick={() => setDepth(0)}
              role={'presentation'}
            >
              <div className={styles.previousIcon}>
                <Icon symbol={'caret'}></Icon>
              </div>
              <span>{category.menuLabel}</span>
            </div>
          )}

          {depth === 2 && (
            <div
              className={styles.previousLinkContainer}
              onClick={() => setDepth(1)}
              role={'presentation'}
            >
              <div className={styles.previousIcon}>
                <Icon symbol={'caret'}></Icon>
              </div>
              <span>{subMenu.categoryLabel}</span>
            </div>
          )}
        </div>

        <div className={styles.mobileNavContainer}>
          {/* dynamic portion */}
          {depth === 0 && (
            <div>
              {Config.headerLinks.map((navObject) => {
                const hasSubmenu =
                  navObject.category?.length !== undefined ? true : false;
                return (
                  <Link
                    key={navObject.menuLink}
                    className={`${styles.mobileLink}`}
                    to={hasSubmenu === true ? '' : navObject.menuLink}
                    onClick={() => {
                      if (hasSubmenu) {
                        setDepth(1);
                        setCategory(navObject);
                      }
                    }}
                  >
                    {navObject.menuLabel}
                    {hasSubmenu && <Icon symbol={'caret'}></Icon>}
                  </Link>
                );
              })}
            </div>
          )}

          {depth === 1 &&
            category.category.map((menuItem) => {
              return (
                <Link
                  key={menuItem.categoryLabel}
                  to={''}
                  onClick={() => {
                    setDepth(2);
                    setSubMenu(menuItem);
                  }}
                  className={`${styles.mobileLink}`}
                >
                  {menuItem.categoryLabel}
                  <Icon symbol={'caret'}></Icon>
                </Link>
              );
            })}

          {depth === 2 &&
            subMenu.submenu.map((menuItem) => {
              return (
                <Link
                  key={menuItem.menuLabel}
                  to={menuItem.menuLink}
                  className={`${styles.edgeLink}`}
                >
                  {menuItem.menuLabel}
                </Link>
              );
            })}

          {depth === -1 && (
            <>
              <div>
                <Link to={'/account/orders/'} className={styles.mobileLink}>
                  Orders
                </Link>
                {/* <Link to={'/account/address/'} className={styles.mobileLink}>
                  Addresses
                </Link> */}
                <Link to={'/account/settings/'} className={styles.mobileLink}>
                  Settings
                </Link>
                {/* <Link to={'/account/viewed/'} className={styles.mobileLink}>
                  Recently Viewed
                </Link> */}
              </div>
              <div className={styles.navFooter}>
                <div
                  className={styles.logoutContainer}
                  role={'presentation'}
                  onClick={handleLogout}
                >
                  <Icon symbol={'logout'} />
                  <span>Sign out </span>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default MobileNavigation;
