import React, { useState, useEffect, createRef } from 'react';
import { graphql, Link, navigate, useStaticQuery } from 'gatsby';

import { isLoggedIn } from '../../utils';

import AddNotification from '../AddNotification';
import Brand from '../Brand';
import Container from '../Container';
import Config from '../../utils/config.json';
import Drawer from '../Drawer';
import ExpandedMenu from '../ExpandedMenu';
import FormInputField from '../FormInputField/FormInputField';
import Icon from '../Icons/Icon';
import MiniCart from '../MiniCart';
import MobileNavigation from '../MobileNavigation';
import * as styles from './Header.module.css';
import { useContext } from 'react';
import CartContext from '../../context/CartProvider';

function _constructCategoryTree(node, categories) {
  categories.forEach((category) => {
    if (category.parentId === node.id) {
      const newNode = {
        ...category,
        menuLabel: category.name,
        menuLink: `/category/${category.slug}`,
        submenu: [],
      }
      node.submenu.push(newNode);
      _constructCategoryTree(newNode, categories);
    }
  })
}
function constructCategoryTreeRecursively(categories) {
  const rootNode = { id: null, submenu: [] };
  _constructCategoryTree(rootNode, categories);
  return rootNode;
}
const Header = (props) => {
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showMenu, setShowMenu] = useState(true);

  const [menu, setMenu] = useState();
  const [activeMenu, setActiveMenu] = useState();

  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  const searchRef = createRef();
  const { state } = useContext(CartContext);


  const data = useStaticQuery(graphql`
fragment productCategory on WordPress_ProductCategory {
    name
      menuOrder
      parentId
      slug
      id
  }
query Categories {
    wordpress {
    productCategories {
    nodes {
    ...productCategory
  }
    }
  }
}`)
  useEffect(() => {
    const categories = data.wordpress.productCategories.nodes;
    const catTree = constructCategoryTreeRecursively(categories);
    Config.headerLinks[0].category = catTree.submenu;
  }, [data]);
  

  const handleHover = (navObject) => {
    if (navObject.category) {
      setShowMenu(true);
      setMenu(navObject.category);
      setShowSearch(false);
    } else {
      setMenu(undefined);
    }
    setActiveMenu(navObject.menuLabel);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${search}`);
    setShowSearch(false);
  };

  // disable active menu when show menu is hidden
  useEffect(() => {
    if (showMenu === false) setActiveMenu(false);
  }, [showMenu]);

  // hide menu onscroll
  useEffect(() => {
    const onScroll = () => {
      setShowMenu(false);
      setShowSearch(false);
      setActiveMenu(undefined);
    };
    window.removeEventListener('scroll', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  //listen for show search and delay trigger of focus due to CSS visiblity property
  useEffect(() => {
    if (showSearch === true) {
      setTimeout(() => {
        searchRef.current.focus();
      }, 250);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSearch]);

  return (
    <div className={styles.root}>
      <Container size={'large'} spacing={'min'}>
        {/* header container */}
        <div className={styles.header}>
          <div className={styles.linkContainer}>
            <nav
              role={'presentation'}
              onMouseLeave={() => {
                setShowMenu(false);
              }}
            >
              {Config.headerLinks.map((navObject) => (
                <Link
                  key={navObject.menuLink}
                  onMouseEnter={() => handleHover(navObject)}
                  className={`${styles.navLink} ${activeMenu === navObject.menuLabel ? styles.activeLink : ''
                    }`}
                  to={navObject.menuLink}
                >
                  {navObject.menuLabel}
                </Link>
              ))}
            </nav>
          </div>
          <div
            role={'presentation'}
            onClick={() => {
              setMobileMenu(!mobileMenu);
              // setDepth(0);
            }}
            className={styles.burgerIcon}
          >
            <Icon symbol={`${mobileMenu === true ? 'cross' : 'burger'}`}></Icon>
          </div>
          <Brand />
          <div className={styles.actionContainers}>
            <button
              aria-label="Search"
              className={`${styles.iconButton} ${styles.iconContainer}`}
              onClick={() => {
                setShowSearch(!showSearch);
              }}
            >
              <Icon symbol={'search'}></Icon>
            </button>
            <Link
              aria-label="Orders"
              to={isLoggedIn() ? '/login' : '/account/orders/'}
              className={`${styles.iconContainer} ${styles.hideOnMobile}`}
            >
              <Icon symbol={'user'}></Icon>
            </Link>
            <button
              aria-label="Cart"
              className={`${styles.iconButton} ${styles.iconContainer} ${styles.bagIconContainer}`}
              onClick={() => {
                setShowMiniCart(true);
                setMobileMenu(false);
              }}
            >
              <Icon symbol={'bag'}></Icon>
              <div className={styles.bagNotification}>
                <span>{state?.cart?.contents?.itemCount ?? 0}</span>
              </div>
            </button>
            <div className={styles.notificationContainer}>
              <AddNotification openCart={() => setShowMiniCart(true)} />
            </div>
          </div>
        </div>

        {/* search container */}
        <div
          className={`${styles.searchContainer} ${showSearch === true ? styles.show : styles.hide
            }`}
        >
          <h4>What are you looking for?</h4>
          <form className={styles.searchForm} onSubmit={(e) => handleSearch(e)}>
            <FormInputField
              ref={searchRef}
              icon={'arrow'}
              id={'searchInput'}
              value={search}
              placeholder={''}
              type={'text'}
              handleChange={(_, e) => setSearch(e)}
            />
          </form>
          
          <div
            role={'presentation'}
            onClick={(e) => {
              e.stopPropagation();
              setShowSearch(false);
            }}
            className={styles.backdrop}
          ></div>
        </div>
      </Container>

      {/* menu container */}
      <div
        role={'presentation'}
        onMouseLeave={() => setShowMenu(false)}
        onMouseEnter={() => setShowMenu(true)}
        className={`${styles.menuContainer} ${showMenu === true ? styles.show : ''
          }`}
      >
        <Container size={'large'} spacing={'min'}>
          <ExpandedMenu menu={menu} />
        </Container>
      </div>

      {/* minicart container */}
      <Drawer visible={showMiniCart} close={() => setShowMiniCart(false)}>
        <MiniCart />
      </Drawer>

      {/* mobile menu */}
      <div className={styles.mobileMenuContainer}>
        <Drawer
          hideCross
          top={'98px'}
          isReverse
          visible={mobileMenu}
          close={() => setMobileMenu(false)}
        >
          <MobileNavigation close={() => setMobileMenu(false)} />
        </Drawer>
      </div>
    </div>
  );
};

export default Header;


