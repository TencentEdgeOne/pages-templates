'use client'
import React, { useCallback, useEffect, useState } from 'react'
import type { AppTypeValue } from '@/config'
import { setLocaleOnClient } from '@/i18n/client'
import { resolveAppType, difyLocaleToAppLocale } from '@/utils/resolve-app-type'
import Completion from './completion'
import ChatGeneration from './chat-generation'
import ConversationSidebar from './conversation-sidebar'
import Loading from '@/app/components/base/loading'

/**
 * Root component — detects the app type at runtime by calling the Dify API,
 * then renders the appropriate UI:
 *
 * - completion / workflow → Completion
 * - chat / agent          → ConversationSidebar + ChatGeneration
 *
 * App type is resolved via resolveAppType() in utils/resolve-app-type.ts:
 *   • NEXT_PUBLIC_APP_TYPE env var is set and valid → used directly (fast path)
 *   • otherwise → inferred from /v1/parameters + /v1/meta (dynamic path)
 *
 * If detection fails we fall back to 'completion' so the app always renders.
 */

const THEMES = ['', 'dark', 'cool', 'minimal'] as const
type Theme = typeof THEMES[number]

const AppEntry: React.FC = () => {
  const [appType, setAppType] = useState<AppTypeValue | null>(null)
  const [appParams, setAppParams] = useState<any>(null)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
  const [sidebarRefreshSignal, setSidebarRefreshSignal] = useState(0)
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-theme')
      if (saved && THEMES.includes(saved as Theme))
        return saved as Theme
    }
    return ''
  })

  const triggerSidebarRefresh = useCallback(() => {
    setSidebarRefreshSignal(prev => prev + 1)
  }, [])

  // Apply theme to <html> element and persist to localStorage
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('app-theme', theme)
  }, [theme])

  const cycleTheme = useCallback(() => {
    setTheme((prev) => {
      const idx = THEMES.indexOf(prev)
      return THEMES[(idx + 1) % THEMES.length]
    })
  }, [])

  // Resolve app type once on mount; also read default_language for locale
  useEffect(() => {
    let cancelled = false
    resolveAppType().then(({ appType, appParams }) => {
      if (cancelled) return

      setAppType(appType)
      setAppParams(appParams)

      // Auto-switch locale from Dify's default_language field
      const difyLang = (appParams as any)?.default_language
      if (difyLang) {
        const locale = difyLocaleToAppLocale(difyLang)
        if (locale)
          setLocaleOnClient(locale, /* notReload */ true)
      }
    })
    return () => { cancelled = true }
  }, [])

  // Theme label displayed on toggle button
  const themeLabel = theme === '' ? '☀️ Warm' : theme === 'dark' ? '🌙 Dark' : theme === 'cool' ? '🔵 Cool' : '⬜ Minimal'

  // Show a minimal spinner while detecting
  if (appType === null) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
        <Loading type="area" />
      </div>
    )
  }

  if (appType === 'completion' || appType === 'workflow')
    return (
      <>
        <Completion />
        <button className="themeToggle" onClick={cycleTheme}>{themeLabel}</button>
      </>
    )

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', overflow: 'hidden', background: 'var(--color-bg)' }}>
      <ConversationSidebar
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        refreshSignal={sidebarRefreshSignal}
        appType={appType}
      />
      <div style={{ flex: 1, overflow: 'hidden', background: 'var(--color-bg)' }}>
        <ChatGeneration
          conversationId={activeConversationId}
          appType={appType}
          appParams={appParams}
          onConversationCreated={(id) => {
            setActiveConversationId(id)
            triggerSidebarRefresh()
          }}
          onMessagesChange={triggerSidebarRefresh}
        />
      </div>
      <button className="themeToggle" onClick={cycleTheme}>{themeLabel}</button>
    </div>
  )
}

export default AppEntry

