'use client'

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './product-demo.module.css'

const ProductFeatures: React.FC = () => {
  const { t } = useTranslation()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const FEATURES = [
    { icon: '💬', title: t('app.productDemo.features.multiModeTitle'), desc: t('app.productDemo.features.multiModeDesc') },
    { icon: '🔌', title: t('app.productDemo.features.embedTitle'),     desc: t('app.productDemo.features.embedDesc') },
    { icon: '📁', title: t('app.productDemo.features.fileTitle'),      desc: t('app.productDemo.features.fileDesc') },
    { icon: '🔊', title: t('app.productDemo.features.voiceTitle'),     desc: t('app.productDemo.features.voiceDesc') },
    { icon: '📜', title: t('app.productDemo.features.historyTitle'),   desc: t('app.productDemo.features.historyDesc') },
    { icon: '🌍', title: t('app.productDemo.features.i18nTitle'),      desc: t('app.productDemo.features.i18nDesc') },
  ]

  const SPECS = [
    { label: t('app.productDemo.specs.stackLabel'),     value: t('app.productDemo.specs.stackValue') },
    { label: t('app.productDemo.specs.styleLabel'),     value: t('app.productDemo.specs.styleValue') },
    { label: t('app.productDemo.specs.backendLabel'),   value: t('app.productDemo.specs.backendValue') },
    { label: t('app.productDemo.specs.protocolLabel'),  value: t('app.productDemo.specs.protocolValue') },
    { label: t('app.productDemo.specs.modeLabel'),      value: t('app.productDemo.specs.modeValue') },
    { label: t('app.productDemo.specs.deployLabel'),    value: t('app.productDemo.specs.deployValue') },
    { label: t('app.productDemo.specs.licenseLabel'),   value: t('app.productDemo.specs.licenseValue') },
    { label: t('app.productDemo.specs.minConfigLabel'), value: t('app.productDemo.specs.minConfigValue') },
  ]

  const FAQS = [0, 1, 2, 3, 4].map(i => ({
    q: t(`app.productDemo.faq.q${i}`),
    a: t(`app.productDemo.faq.a${i}`),
  }))

  return (
    <>
      {/* Feature cards */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t('app.productDemo.features.sectionTitle')}</h2>
            <p className={styles.sectionDesc}>{t('app.productDemo.features.sectionDesc')}</p>
          </div>
          <div className={styles.featuresGrid}>
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specs + FAQ */}
      <section className={styles.specFaqSection}>
        <div className={styles.sectionInner}>
          <div className={styles.specFaqGrid}>
            {/* Left: specs table */}
            <div>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 24 }}>
                {t('app.productDemo.specs.sectionTitle')}
              </h2>
              <div className={styles.specTable}>
                {SPECS.map(s => (
                  <div key={s.label} className={styles.specRow}>
                    <span className={styles.specLabel}>{s.label}</span>
                    <span className={styles.specValue}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: FAQ */}
            <div>
              <h2 className={styles.sectionTitle} style={{ marginBottom: 24 }}>
                {t('app.productDemo.faq.sectionTitle')}
              </h2>
              <div className={styles.faqList}>
                {FAQS.map((faq, i) => (
                  <div key={i} className={styles.faqItem}>
                    <button
                      className={styles.faqQuestion}
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <span>{faq.q}</span>
                      <span className={`${styles.faqChevron}${openFaq === i ? ` ${styles.faqChevronOpen}` : ''}`}>
                        ›
                      </span>
                    </button>
                    <div className={`${styles.faqAnswer}${openFaq === i ? ` ${styles.faqAnswerOpen}` : ''}`}>
                      <p>{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.sectionInner}>
          <div className={styles.ctaBox}>
            <h2 className={styles.ctaTitle}>{t('app.productDemo.cta.title')}</h2>
            <p className={styles.ctaDesc}>{t('app.productDemo.cta.desc')}</p>
            <div className={styles.ctaActions}>
              <a href="/embed" className={styles.btnPrimary}>
                {t('app.productDemo.cta.btnEmbed')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ProductFeatures
