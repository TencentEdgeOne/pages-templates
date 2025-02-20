import React from 'react';
import * as styles from './Policy.module.css';

const Policy = (props) => {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <h3>1. Lorem Ipsum</h3>
        <p>
          Delaware limited liability company (The Sydney) collects personal
          information that you voluntarily provide when applying or registering
          for an account with The Upside or making a purchase on The Upside
          website; www.theupside.com (the Website).
        </p>
        <p>
          This Privacy Policy (Privacy Policy) outlines how your information is
          collected, used and disclosed when you access or use our Services as
          defined in our Terms. This information is collected, used and
          disclosed in accordance with the Privacy Act 1988 (Cth) (Privacy Act).{' '}
        </p>
        <p>
          This Privacy Policy is incorporated by reference into our Terms. Any
          capitalized terms not defined in this Policy are defined in the Terms.
          You agree to comply with all Terms when accessing or using our
          Services, including this Privacy Policy.
        </p>
      </div>

      <div className={styles.section}>
        <h3>2. Lorem Ipsum</h3>
        <p>
          Our Services, including but not limited to the registration of an
          account with us or placing of an order, is not intended to be used by
          children under the age of 13. When a visitor indicates an age under
          13, the registration process for The Upside website cannot be
          completed, and no personally identifying information is collected in
          conjunction with that attempted submission except that we retain
          e-mail addresses of such persons (and record of access attempts) for
          purposes of denying registration. Otherwise, we do not knowingly
          collect personally identifiable information from visitors under the
          age of 13.
        </p>
        <p>
          If you are under 18, any use of our Services must be with the
          involvement of a parent or guardian. By accessing or using our
          Website, you warrant and represent to us that you are over the age of
          18 years and you have the right, authority and legal capacity to enter
          into a legally binding agreement and to abide by this Privacy Policy.{' '}
        </p>
        <p>
          The Upside collects, uses and discloses information regarding users
          aged 13-18 in the same manner as it does for adults.{' '}
        </p>
      </div>

      <div className={styles.section}>
        <h3>3. Lorem Ipsum</h3>
        <p>
          You must only use our Services in accordance with this Privacy Policy
          and any applicable law or regulations. You agree to refrain from
          undertaking any prohibited acts as set out in this Clause 3. You must
          not (or attempt to):{' '}
        </p>
        <p>
          (a) interfere with or disrupt the use of Services or the website, in
          any manner including but not limited to the servicers or networks that
          host the website;{' '}
        </p>
        <p>(b) stalk, harass, threaten, intimidate or harm another; </p>
        <p>
          (c) pretend to be anyone, or any entity, you are not, you will not
          impersonate or misrepresent yourself as another person (including
          celebrities), entity, a The Upside employee, or a civic or government
          leader, or otherwise misrepresent your affiliation with a person or
          entity. The Upside reserves the right to reject or block any user
          which could be deemed to be an impersonation or misrepresentation of
          your identity, or a misappropriation of another person's name or
          identity;{' '}
        </p>
        <p>
          (d) engage in any copyright infringement or other intellectual
          property infringement, or disclose any trade secret or confidential
          information in violation of a confidentiality, employment, or
          non-disclosure agreement or otherwise;{' '}
        </p>
        <p>
          (e) use, distribute, reproduce or commercialize any content from the
          Website or The Upside service except as permitted by this Policy, by
          law, and with prior written agreement from The Upside;{' '}
        </p>
        <p>
          (f) transmit any unsolicited advertising, promotional material or
          other forms of solicitation in connection with your use of the Service
          without the prior written agreement of The Upside;{' '}
        </p>
        <p>
          (g) forge any TCP-IP packet header or any part of the header
          information or otherwise putting Information in a header designed to
          mislead recipients as to the origin of any content transmitted through
          the Website ("spoofing";);
        </p>
      </div>
    </div>
  );
};

export default Policy;
