'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { setLocaleOnClient } from '@/i18n/client'
import type { Locale } from '@/i18n'
import styles from './nav-bar.module.css'

const LOCALES: { value: Locale; label: string }[] = [
  { value: 'en',      label: 'EN' },
  { value: 'zh-Hans', label: '中' },
]

const NavBar = () => {
  const pathname = usePathname()
  // i18n.language is kept up-to-date by I18nProvider (changeLanguage called on
  // every render if locale differs), so we can derive currentLocale from it
  // directly — no separate state or useEffect needed.
  const { t, i18n } = useTranslation()
  const currentLocale = i18n.language as Locale

  const NAV_LINKS = [
    { label: t('app.nav.demo'),    href: '/' },
    { label: t('app.nav.support'), href: '/support' },
    { label: t('app.nav.embed'),   href: '/embed' },
  ]

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      {/* Brand area */}
      <div className={styles.brand}>
        <span className={styles.brandIcon}>🤖</span>
        <span className={styles.brandName}>{t('app.nav.brandName')}</span>
      </div>

      {/* Right side: nav links + language switcher */}
      <div className={styles.right}>
        <ul className={styles.links}>
          {NAV_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={pathname === href ? 'page' : undefined}
                className={[
                  styles.link,
                  pathname === href ? styles.linkActive : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Language switcher */}
        <div className={styles.langSwitcher} aria-label="Language switcher">
          {LOCALES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setLocaleOnClient(value)}
              className={[
                styles.langBtn,
                currentLocale === value ? styles.langBtnActive : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-pressed={currentLocale === value}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
