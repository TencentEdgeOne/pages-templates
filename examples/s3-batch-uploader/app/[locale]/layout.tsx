import { notFound } from 'next/navigation'
import { I18nProvider } from './i18n-provider'

const locales = ['zh', 'en']

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  if (!locales.includes(locale)) {
    notFound()
  }

  return (
    <I18nProvider locale={locale}>
      {children}
    </I18nProvider>
  )
}