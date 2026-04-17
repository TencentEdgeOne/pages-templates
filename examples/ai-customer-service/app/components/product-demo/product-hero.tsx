'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import styles from './product-demo.module.css'

const ProductHero: React.FC = () => {
  const { t } = useTranslation()

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        {/* Left: copy + CTA */}
        <div className={styles.heroContent}>
          <div className={styles.badge}>{t('app.productDemo.hero.badge')}</div>
          <h1 className={styles.heroTitle}>
            {t('app.productDemo.hero.titleStart')}
            <span className={styles.heroTitleAccent}>{t('app.productDemo.hero.titleAccent')}</span>
            {t('app.productDemo.hero.titleEnd')}
          </h1>
          <p className={styles.heroDesc}>{t('app.productDemo.hero.desc')}</p>

          <div className={styles.heroMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaDot} style={{ background: '#22c55e' }} />
              <span>{t('app.productDemo.hero.metaOpen')}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaDot} style={{ background: '#C8754A' }} />
              <span>{t('app.productDemo.hero.metaDeploy')}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaDot} style={{ background: '#6366f1' }} />
              <span>{t('app.productDemo.hero.metaPrivate')}</span>
            </div>
          </div>
        </div>

        {/* Right: product visual card */}
        <div className={styles.heroVisual}>
          <div className={styles.visualCard}>
            <div className={styles.visualHeader}>
              <div className={styles.visualDots}>
                <span className={styles.dot} style={{ background: '#ff5f57' }} />
                <span className={styles.dot} style={{ background: '#febc2e' }} />
                <span className={styles.dot} style={{ background: '#28c840' }} />
              </div>
              <div className={styles.visualUrl}>ai-customer-service.demo</div>
            </div>
            <div className={styles.visualBody}>
              <div className={styles.visualMockChat}>
                <div className={styles.mockMsg + ' ' + styles.mockMsgBot}>
                  <div className={styles.mockAvatar}>AI</div>
                  <div className={styles.mockBubble}>{t('app.productDemo.hero.mockGreeting')}</div>
                </div>
                <div className={styles.mockMsg + ' ' + styles.mockMsgUser}>
                  <div className={styles.mockBubble + ' ' + styles.mockBubbleUser}>
                    {t('app.productDemo.hero.mockUserQ')}
                  </div>
                </div>
                <div className={styles.mockMsg + ' ' + styles.mockMsgBot}>
                  <div className={styles.mockAvatar}>AI</div>
                  <div className={styles.mockBubble}>
                    {t('app.productDemo.hero.mockBotAnswerIntro')}
                    <br />{t('app.productDemo.hero.mockDocker')}
                    <br />{t('app.productDemo.hero.mockSaas')}
                    <br />{t('app.productDemo.hero.mockK8s')}
                    <br />
                    <span className={styles.mockTyping}>
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative float cards */}
          <div className={styles.floatCard1}>
            <span className={styles.floatIcon}>⚡</span>
            <div>
              <div className={styles.floatTitle}>{t('app.productDemo.hero.floatSpeedLabel')}</div>
              <div className={styles.floatValue}>&lt; 1s</div>
            </div>
          </div>
          <div className={styles.floatCard2}>
            <span className={styles.floatIcon}>🌐</span>
            <div>
              <div className={styles.floatTitle}>{t('app.productDemo.hero.floatLangLabel')}</div>
              <div className={styles.floatValue}>20+</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductHero
