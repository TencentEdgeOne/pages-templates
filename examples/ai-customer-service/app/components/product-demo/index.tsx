'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import ProductHero from './product-hero'
import ProductFeatures from './product-features'
import styles from './product-demo.module.css'

/**
 * ProductDemoPage
 *
 * Main component for the product demo page, simulating a real SaaS product landing page
 * to demonstrate "what it looks like after deploying the AI customer service template to your own website".
 *
 * This component only handles the page content layout; the floating widget is overlaid by the parent DemoHomePage.
 */
const ProductDemoPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div>
      {/* Hero */}
      <ProductHero />

      {/* Features + Specs + FAQ + CTA */}
      <ProductFeatures />

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <span className={styles.footerBrand}>🤖 AI Customer Service</span>
          <span className={styles.footerText}>
            {t('app.productDemo.footer.copyright')}
          </span>
          <div className={styles.footerLinks}>
            <a
              href="https://github.com/langgenius/dify"
              target="_blank"
              rel="noreferrer"
              className={styles.footerLink}
            >
              GitHub
            </a>
            <a href="/embed" className={styles.footerLink}>
              {t('app.productDemo.footer.embedLink')}
            </a>
            <a href="/support" className={styles.footerLink}>
              {t('app.productDemo.footer.supportLink')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ProductDemoPage
