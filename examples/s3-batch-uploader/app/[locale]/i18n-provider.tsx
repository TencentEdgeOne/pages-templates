'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

interface TranslationContextType {
  t: (key: string, params?: Record<string, any>) => string
  locale: string
}

const TranslationContext = createContext<TranslationContextType | null>(null)

export function I18nProvider({ 
  children, 
  locale 
}: { 
  children: ReactNode
  locale: string 
}) {
  const [translations, setTranslations] = useState<Record<string, any>>({})

  useEffect(() => {
    // 加载翻译文件
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}/common.json`)
        if (response.ok) {
          const data = await response.json()
          setTranslations(data)
        }
      } catch (error) {
        console.error('Failed to load translations:', error)
      }
    }

    loadTranslations()
  }, [locale])

  const t = (key: string, params?: Record<string, any>) => {
    // 支持嵌套键名，如 "navigation.appTitle"
    const keys = key.split('.')
    let translation: any = translations
    
    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k]
      } else {
        translation = undefined
        break
      }
    }
    
    // 如果找不到翻译，返回键名
    if (translation === undefined || translation === null) {
      return key
    }
    
    // 处理参数替换
    if (params && typeof translation === 'string') {
      return Object.entries(params).reduce((str, [key, value]) => {
        return str.replace(new RegExp(`{{${key}}}`, 'g'), String(value))
      }, translation)
    }
    
    return String(translation)
  }

  return (
    <TranslationContext.Provider value={{ t, locale }}>
      {children}
    </TranslationContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider')
  }
  return context
}