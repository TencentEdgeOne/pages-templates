import React, { useRef } from 'react';

import Container from '../components/Container';
import Elevator from '../components/Elevator';
import Hero from '../components/Hero';
import Layout from '../components/Layout/Layout';

import { graphql } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import * as styles from './about.module.css';
console.log('styles', styles);
const AboutPage = () => {
  let historyRef = useRef();
  let valuesRef = useRef();
  let sustainabilityRef = useRef();

  const handleScroll = (elementReference) => {
    if (elementReference) {
      window.scrollTo({
        behavior: 'smooth',
        top: elementReference.current.offsetTop - 280,
      });
    }
  };

  return (
    <Layout disablePaddingBottom>
      <div className={styles.root}>
        <Hero
          maxWidth={'900px'}
          image={'/about.png'}
          title={`Gem Aura \n A crystal brand since 2024`}
        />

        <div className={styles.navContainer}>
          <Elevator onClick={() => handleScroll(historyRef)} to={'#history'}>
            History
          </Elevator>
          <Elevator onClick={() => handleScroll(valuesRef)} to={'#values'}>
            Values
          </Elevator>
          <Elevator
            onClick={() => handleScroll(sustainabilityRef)}
            to={'#sustainability'}
          >
            Sustainability
          </Elevator>
        </div>

        <Container size={'large'} spacing={'min'}>
          <div className={styles.detailContainer} ref={historyRef}>
            <p>
              Gem Aura, established in 2024, is a visionary brand that
              strives to bridge the gap between the raw power of nature
              and human life.
            </p>
            <br />
            <br />
            <p>
              We believe in the transformative potential of crystals,
              using them as conduits for positive energy and spiritual growth.
            </p>
          </div>
        </Container>

        <div className={styles.imageContainer}>
          <StaticImage alt={'crystal'} src={'../../static/about1.png'} />
        </div>

        <Container size={'large'} spacing={'min'}>
          <div className={styles.content}>
            <div ref={valuesRef}>
              <h3>Our Values</h3>
            </div>

            <div >
              <p>
                Gem Aura pioneered the integration of healing crystals into
                modern lifestyle. In the early 2024, we began sourcing premium
                natural crystals from Earth's most sacred locations, carefully
                selecting each piece for its unique energetic properties.
                While traditional crystal practices were often shrouded in
                mysticism, we've transformed them into accessible daily wellness
                tools through innovative design and contemporary aesthetics.
                We've guided people as crystals have evolved from spiritual
                artifacts to lifestyle essentials, from meditation aids to
                fashion statements, and we've dedicated ourselves to perfecting
                every aspect of crystal selection, craftsmanship,
                and energy preservation.
              </p>
              <ol>
                <li>Natural Resonance</li>
                <li>Spiritual Enlightenment</li>
                <li>Quality Heritage</li>
              </ol>
            </div>
          </div>
          <div className={styles.content} style={{ gridTemplateColumns: '3fr 2fr' }}>
            <div id={'#sustainability'} ref={sustainabilityRef}>
              <p>
                Our founder, Emma Crystal, possessed both a profound appreciation
                for the intrinsic qualities of crystals and a passion for pushing
                the boundaries of their application. Alongside sourcing the most
                exquisite natural crystals, she developed our proprietary crystal-infused
                resins and unique cutting techniques. CrystalBrand continues this
                legacy of innovation to this day, with our distinctive offerings
                including: Quantum Quench crystals for deep healing, Aura Align
                minerals for balance, and Luminous Lustre stones for enhanced
                radiance. The science behind these advancements remains at the
                forefront of our craft, ensuring that every CrystalBrand product
                embodies the purest essence of crystal energy and quality.

              </p>
              <p>
                Crafted in the serene mountains of Switzerland, where the energy
                of the earth is said to be at its most potent, our signature crystal
                pendants are made from the finest quality, ethically sourced crystals
                for unmatched purity, comfort, and metaphysical depth. With over a
                decade spent refining the harmony between crystal and design,
                the CrystalBrand Pendant is acknowledged as the zenith of crystal
                artistry in the world.
              </p>
            </div>
            <h3 style={{ textAlign: 'right' }}>Sustaiability</h3>

          </div>

        </Container>

        <div className={styles.imageContainer}>
          <StaticImage alt={'shirt backwards'} src='../../static/about3.png' />
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;

export const query = graphql`
query AboutPage {
  wordpress {
    page(id: "about", idType: URI) {
      content
    }
  }
}
`