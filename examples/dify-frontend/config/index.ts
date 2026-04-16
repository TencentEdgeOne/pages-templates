import type { AppInfo } from '@/types/app'

export const APP_ID = `${process.env.APP_KEY}` // kept for legacy API routes
export const API_KEY = `${process.env.APP_KEY}`
export const API_URL = `${process.env.API_URL}`

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
 * Legacy boolean for completion mode — derived from NEXT_PUBLIC_APP_TYPE
 * so it stays in sync with the new env-var fast path.
 */
export const IS_WORKFLOW = process.env.NEXT_PUBLIC_APP_TYPE === 'workflow'

/** Fallback app info — actual info is fetched at runtime via /v1/meta */
export const APP_INFO: AppInfo = {
  title: 'Text Generator APP',
  description: '',
  copyright: '',
  privacy_policy: '',
  default_language: 'en',
}
