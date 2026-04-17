import { getLocaleOnServer } from '@/i18n/server'

import './styles/globals.css'
import './styles/markdown.scss'

const LocaleLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const locale = await getLocaleOnServer()
  return (
    <html lang={locale ?? 'en'} className="h-full" suppressHydrationWarning>
      <head>
        {/* Inline script: read saved theme before first paint to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var t = localStorage.getItem('app-theme');
            if(t) document.documentElement.dataset.theme = t;
          })();
        ` }} />
      </head>
      <body className="h-full">
        {children}
      </body>
    </html>
  )
}

export default LocaleLayout
