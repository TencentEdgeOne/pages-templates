import type { AppTypeValue } from '@/config'
import type { Locale } from '@/i18n'

export function detectAppType(params: unknown, meta: unknown): AppTypeValue {
  if (params && typeof params === 'object' && 'workflow' in params)
    return 'workflow'

  const p = params as Record<string, unknown> | null | undefined
  const isChatLike
    = p?.speech_to_text !== undefined
    || p?.suggested_questions_after_answer !== undefined
    || p?.text_to_speech !== undefined

  if (!isChatLike)
    return 'completion'

  const hasTools
    = meta
    && typeof meta === 'object'
    && 'tool_icons' in meta
    && Object.keys((meta as Record<string, unknown>).tool_icons as object || {}).length > 0

  return hasTools ? 'agent' : 'chat'
}

/** Map Dify locale names to supported i18n locales */
export function difyLocaleToAppLocale(difyLocale: string): Locale | null {
  const lower = difyLocale.toLowerCase()
  if (lower === 'zh-hans' || lower === 'zh_hans' || lower.startsWith('zh'))
    return 'zh-Hans'
  if (lower.startsWith('en'))
    return 'en'
  return null
}
