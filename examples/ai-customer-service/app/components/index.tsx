'use client'
import React, { useEffect, useState } from 'react'
import { setLocaleOnClient } from '@/i18n/client'
import { i18n as i18nConfig } from '@/i18n'
import { difyLocaleToAppLocale } from '@/utils/detect-app-type'
import { resolveAppType } from '@/utils/resolve-app-type'
import type { AppTypeValue } from '@/config'
import CustomerServiceShell from './customer-service'
import Loading from '@/app/components/base/loading'

const AppEntry: React.FC = () => {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
        <Loading type="area" />
      </div>
    )
  }

  const appName: string | undefined = appMeta?.name ?? appParams?.name ?? undefined
  const appIcon: string | undefined = appMeta?.icon ?? undefined

  return (
    <CustomerServiceShell
      appType={appType}
      appParams={appParams}
      appName={appName}
      appIcon={appIcon}
      isEmbed={false}
    />
  )
}

export default AppEntry
