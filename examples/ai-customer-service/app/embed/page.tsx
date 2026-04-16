/**
 * /embed 嵌入专用入口
 *
 * 第三方网站通过 <iframe src="/embed"> 接入，稳定 URL，
 * 默认以紧凑模式渲染（isEmbed=true）。
 *
 * 用法示例：
 *   <iframe src="https://your-domain.com/embed" width="400" height="600" />
 */
'use client'
import React, { useEffect, useState } from 'react'
import type { AppTypeValue } from '@/config'
import { setLocaleOnClient } from '@/i18n/client'
import { i18n as i18nConfig } from '@/i18n'
import { difyLocaleToAppLocale } from '@/utils/detect-app-type'
import { resolveAppType } from '@/utils/resolve-app-type'
import CustomerServiceShell from '@/app/components/customer-service'
import Loading from '@/app/components/base/loading'

const EmbedPage: React.FC = () => {
  const [appType, setAppType] = useState<AppTypeValue | null>(null)
  const [appParams, setAppParams] = useState<any>(null)
  const [appMeta, setAppMeta] = useState<any>(null)

  useEffect(() => {
    let cancelled = false
    resolveAppType().then(({ appType, appParams, appMeta }) => {
      if (cancelled) return
      setAppType(appType)
      setAppParams(appParams)
      setAppMeta(appMeta)

      const difyLang = appParams?.default_language
      if (difyLang) {
        const locale = difyLocaleToAppLocale(difyLang)
        if (locale && locale !== i18nConfig.defaultLocale)
          setLocaleOnClient(locale, true)
      }
    })
    return () => { cancelled = true }
  }, [])

  if (appType === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100%' }}>
        <Loading type="area" />
      </div>
    )
  }

  return (
    <div style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <CustomerServiceShell
        appType={appType}
        appParams={appParams}
        appName={appMeta?.name ?? appParams?.name}
        appIcon={appMeta?.icon}
        isEmbed={true}
      />
    </div>
  )
}

export default EmbedPage

