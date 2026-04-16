import type { AppInfo } from '@/types/app'

// APP_KEY / APP_API_URL are not prefixed with NEXT_PUBLIC_ and are therefore
// only readable in server-side API Routes. Client-side (browser) code cannot
// access these values — this is an intentional security design.
export const APP_ID = process.env.APP_KEY ?? '' // kept for legacy API routes
export const API_KEY = process.env.APP_KEY ?? ''
export const API_URL = process.env.APP_API_URL ?? ''

if (!API_KEY && typeof window === 'undefined')
  console.error('[config] APP_KEY is not set — all Dify API calls will fail.')

export const API_PREFIX = '/api'

export const LOCALE_COOKIE_NAME = 'locale'

export const DEFAULT_VALUE_MAX_LEN = 48

/**
 * App type values returned by Dify's /v1/parameters endpoint (inferred) or
 * set explicitly by runtime detection.
 *
 * - completion: single-turn text generation
 * - workflow:   multi-step workflow execution
 * - chat:       multi-turn chat with conversation history
 * - agent:      chat with tool-calling / agent thoughts
 */
export type AppTypeValue = 'completion' | 'workflow' | 'chat' | 'agent'

/**
 * @deprecated Legacy boolean constant — remove after migration is complete.
 * Use the runtime-detected AppTypeValue instead.
 */
export const IS_WORKFLOW = false

/**
 * @deprecated Legacy boolean constant — remove after migration is complete.
 * Use the runtime-detected AppTypeValue instead.
 */
export const IS_CHAT_APP = true

/** Fallback app info — actual info is fetched at runtime via /v1/meta */
export const APP_INFO: AppInfo = {
  title: 'Text Generator APP',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'en',
}
