'use client'

/**
 * I18nProvider
 *
 * Initializes the i18next instance at the application root, ensuring all child
 * components that call useTranslation() receive an already-initialized instance
 * and avoiding SSR hydration mismatches.
 *
 * The `locale` prop is the server-detected language (read from cookie by
 * getLocaleOnServer in layout.tsx). We apply it synchronously before the first
 * render so both SSR and client hydration use the same language — no flash.
 */
import React from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n/i18next-config'
import type { Locale } from '@/i18n'

type Props = {
  locale: Locale
  children: React.ReactNode
}

const I18nProvider = ({ locale, children }: Props) => {
  // Apply synchronously before render. Since all translations are bundled
  // (no async loading), changeLanguage updates i18n.language immediately.
  if (i18n.language !== locale)
    i18n.changeLanguage(locale)

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
}

export default I18nProvider

