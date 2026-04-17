import { getLocaleOnServer } from '@/i18n/server'
import I18nProvider from '@/app/components/i18n-provider'

import './styles/globals.css'
import './styles/markdown.scss'

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full">
      <body className="h-full">
        <I18nProvider locale={locale}>
          {children}
        </I18nProvider>
      </body>
    </html>
  )
}

export default LocaleLayout
