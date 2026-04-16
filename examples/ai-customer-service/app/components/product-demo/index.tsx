'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import ProductHero from './product-hero'
import ProductFeatures from './product-features'
import styles from './product-demo.module.css'

/**
 * ProductDemoPage
 *
 * 商品 Demo 演示页主组件，模拟一个真实的 SaaS 产品落地页，
 * 展示"把 AI 客服模板部署到自己网站后是什么效果"。
 *
 * 该组件仅负责页面内容布局，浮窗由父层 DemoHomePage 叠加。
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
