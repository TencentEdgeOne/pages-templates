'use client'

import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export default function LanguageSwitcher() {
  const router = useRouter()
  const { t } = useTranslation('common')

  const switchLanguage = (locale: string) => {
    // 使用 Next.js 内置 i18n 切换当前路由语言，保持路径不变
    router.push(router.asPath, undefined, { locale })
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">{t('language')}:</span>
      <div className="flex rounded-md overflow-hidden border border-gray-300">
        <button
          onClick={() => switchLanguage('zh')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            router.locale === 'zh'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          中文
        </button>
        <button
          onClick={() => switchLanguage('en')}
          className={`px-3 py-1 text-sm font-medium transition-colors ${
            router.locale === 'en'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          English
        </button>
      </div>
    </div>
  )
}