'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useTranslation } from '../app/[locale]/i18n-provider'
import { useParams } from 'next/navigation'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const { t, locale } = useTranslation()

  const switchLanguage = (newLocale: string) => {
    // 获取当前路径，去掉语言前缀
    const segments = pathname.split('/').filter(Boolean)
    const currentPath = segments.slice(1).join('/') // 去掉第一个语言段
    
    // 构建新的路径
    const newPath = `/${newLocale}/${currentPath}`
    router.push(newPath)
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{t('language')}:</span>
      <div className="flex rounded-md overflow-hidden border border-gray-300">
        <button
          onClick={() => switchLanguage('en')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            locale === 'en'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {t('languages.en')}
        </button>
        <button
          onClick={() => switchLanguage('zh')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            locale === 'zh'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {t('languages.zh')}
        </button>
      </div>
    </div>
  )
}