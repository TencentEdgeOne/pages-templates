import type { AppTypeValue } from '@/config'
import type { Locale } from '@/i18n'
import { i18n as i18nConfig } from '@/i18n'
import { fetchAppParams, fetchAppMeta } from '@/service'

const VALID_TYPES: AppTypeValue[] = ['chat', 'agent', 'workflow', 'completion']

/**
 * Infer app type from Dify API responses.
 *
 * Priority rules:
 * 1. Workflow apps expose a `workflow` key in /v1/parameters.
 * 2. Chat-like apps expose `speech_to_text`, `text_to_speech`, or
 *    `suggested_questions_after_answer`.  Among those, agent apps have
 *    non-empty `tool_icons` in /v1/meta.
 * 3. Anything else is treated as a completion app.
 */
export function detectAppType(params: any, meta: any): AppTypeValue {
  // Workflow apps have a distinct top-level `workflow` key
  if (params && typeof params === 'object' && 'workflow' in params)
    return 'workflow'

  // Chat / Agent apps expose one or more of these fields
  const isChatLike
    = params?.speech_to_text !== undefined
    || params?.suggested_questions_after_answer !== undefined
    || params?.text_to_speech !== undefined

  if (!isChatLike)
    return 'completion'

  // Distinguish agent from plain chat by non-empty tool_icons in meta
  const hasTools
    = meta
    && typeof meta === 'object'
    && 'tool_icons' in meta
    && Object.keys(meta.tool_icons || {}).length > 0

  return hasTools ? 'agent' : 'chat'
}

export interface ResolvedApp {
  /** The determined app type. */
  appType: AppTypeValue
  /** Raw response from /v1/parameters (null if the request failed). */
  appParams: any
}

/**
 * Resolve the app type, using a two-tier strategy:
 *
 * 1. **Fast path** – if `NEXT_PUBLIC_APP_TYPE` is set to a valid value
 *    (`chat | agent | workflow | completion`), use it directly and only
 *    fetch /v1/parameters (the UI needs its payload; /meta is skipped).
 *
 * 2. **Dynamic path** – if the env var is absent or invalid, fetch both
 *    endpoints in parallel and pass the results through detectAppType().
 *
 * Both paths always resolve; individual request failures are swallowed
 * and surfaced as `null` in the returned payloads.
 */
export async function resolveAppType(): Promise<ResolvedApp> {
  const envRaw = process.env.NEXT_PUBLIC_APP_TYPE
  const envType = envRaw && VALID_TYPES.includes(envRaw as AppTypeValue)
    ? (envRaw as AppTypeValue)
    : null

  if (envType) {
    const params = await fetchAppParams().catch(() => null)
    return { appType: envType, appParams: params }
  }

  // Dynamic path: need both endpoints to infer app type
  const [params, meta] = await Promise.all([
    fetchAppParams().catch(() => null),
    fetchAppMeta().catch(() => null),
  ])

  return {
    appType: detectAppType(params, meta),
    appParams: params,
  }
}

/**
 * Maps a Dify `default_language` string (e.g. `"zh-Hans"`, `"en-US"`)
 * to the app's supported Locale type.  Returns `null` if the language is
 * unrecognised or already the default locale.
 */
export function difyLocaleToAppLocale(difyLang: string): Locale | null {
  const lower = difyLang.toLowerCase()
  let locale: Locale | null = null
  if (lower === 'zh-hans' || lower === 'zh_hans' || lower.startsWith('zh'))
    locale = 'zh-Hans'
  else if (lower.startsWith('en'))
    locale = 'en'
  return locale && locale !== i18nConfig.defaultLocale ? locale : null
}
