import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import * as styles from './support.module.css';

import Banner from '../components/Banner';
import Contact from '../components/Contact';
import Layout from '../components/Layout/Layout';
import Elevator from '../components/Elevator';
import Policy from '../components/Policy';
import Container from '../components/Container';

const SupportPage = (props) => {
  const subpages = [
    { title: 'Shipping', key: 'shipping' },
    { title: 'Returns', key: 'returns' },
    { title: 'Payments & Security', key: 'payments' },
    { title: 'Terms & Conditions', key: 'terms' },
    { title: 'Contact Us', key: 'contact' },
    { title: 'Privacy Policy', key: 'policy' },
  ];

  const [current, setCurrent] = useState(subpages[4]);

  const renderElement = (key) => {
    let tempElement = <React.Fragment />;

    switch (key) {
      case 'contact':
        tempElement = <Contact />;
        break;
      case 'policy':
        tempElement = <Policy />;
        break;
      case 'shipping':
        tempElement = <Policy />;
        break;
      case 'returns':
        tempElement = <Policy />;
        break;
      case 'payments':
        tempElement = <Policy />;
        break;
      case 'terms':
        tempElement = <Policy />;
        break;
      default:
        break;
    }
    return tempElement;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (props.location.hash !== '' && props.location.hash !== undefined) {
      const hash = props.location.hash.substring(1);
      const tempCurrent = subpages.filter((detail) => detail.key === hash)[0];
      if (tempCurrent.key !== current.key) {
        setCurrent(tempCurrent);
        window.scrollTo(0, 475);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location]);

  return (
    <Layout disablePaddingBottom>
      <div className={styles.root}>
        <Banner
          maxWidth={'650px'}
          name={current.title}
          bgImage={'/support.png'}
          color={'var(--standard-white)'}
          height={'350px'}
        />

        <div className={styles.navContainer}>
          {subpages.map((details, index) => {
            return (
              <Elevator
                onClick={(e) => {
                  navigate(`/support#${details.key}`);
                }}
                key={details.key}
                isActive={current.key === details.key}
                to={`/support#${details.key}`}
              >
                {details.title}
              </Elevator>
            );
          })}
        </div>

        <div className={styles.pageContainer}>
          <Container size={'large'} spacing={'min'}>
            {subpages.map((details) => {
              return (
                <div
                  key={details.key}
                  className={`${styles.content} ${
                    current.key === details.key ? styles.show : styles.hide
                  }`}
                >
                  {renderElement(details.key)}
                </div>
              );
            })}
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default SupportPage;
