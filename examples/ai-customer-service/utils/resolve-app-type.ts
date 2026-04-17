import type { AppTypeValue } from '@/config'
import { fetchAppParams, fetchAppMeta } from '@/service'
import { detectAppType } from '@/utils/detect-app-type'

const VALID_TYPES: AppTypeValue[] = ['chat', 'agent', 'workflow', 'completion']

export interface ResolvedApp {
  appType: AppTypeValue
  appParams: any
  appMeta: any
  /** true = appType came from NEXT_PUBLIC_APP_TYPE env var; false = dynamically detected */
  fromEnv: boolean
}

/**
 * Unified appType resolution entry:
 *
 * 1. Read the NEXT_PUBLIC_APP_TYPE environment variable.
 * 2. If the value is valid (chat / agent / workflow / completion), use it directly, skipping detectAppType() inference.
 * 3. Otherwise, call /api/parameters + /api/meta and infer dynamically via detectAppType().
 *
 * Regardless of the path taken, appParams and appMeta are always fetched because the customer-service shell depends on them to initialize the UI.
 */
export async function resolveAppType(): Promise<ResolvedApp> {
  const envType = process.env.NEXT_PUBLIC_APP_TYPE

  const [params, meta] = await Promise.all([
    fetchAppParams().catch(() => null),
    fetchAppMeta().catch(() => null),
  ])

  if (envType && VALID_TYPES.includes(envType as AppTypeValue)) {
    return {
      appType: envType as AppTypeValue,
      appParams: params,
      appMeta: meta,
      fromEnv: true,
    }
  }

  return {
    appType: detectAppType(params, meta),
    appParams: params,
    appMeta: meta,
    fromEnv: false,
  }
}
