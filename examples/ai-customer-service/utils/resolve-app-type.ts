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
 * 统一 appType 获取入口：
 *
 * 1. 读取 NEXT_PUBLIC_APP_TYPE 环境变量。
 * 2. 若值合法（chat / agent / workflow / completion），直接采用，跳过 detectAppType() 推断。
 * 3. 否则发起 /api/parameters + /api/meta 并通过 detectAppType() 动态推断。
 *
 * 无论哪条路径，appParams 和 appMeta 始终会被请求，因为客服壳依赖它们初始化 UI。
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
