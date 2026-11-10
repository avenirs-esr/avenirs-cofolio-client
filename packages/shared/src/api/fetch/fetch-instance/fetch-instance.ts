import type { FetchInterceptorManager } from '#shared/api/fetch/fetch-interceptor-manager/fetch-interceptor-manager'
import type { FetchConfig, FetchOptions } from '#shared/api/fetch/types'
import type { BaseApiException } from '#shared/exceptions/base-api-exception/base-api.exception'
import { createCustomFetch } from '#shared/api/fetch/fetch-factory/fetch-factory'

let fetcher: ReturnType<typeof createCustomFetch> | undefined

export function configureSharedFetch (
  config: FetchConfig & { baseUrl: string },
  interceptorManager: FetchInterceptorManager,
): void {
  fetcher = createCustomFetch(config, interceptorManager)
}

export async function sharedFetch<T> (url: string, options?: FetchOptions): Promise<T> {
  if (!fetcher) {
    throw new Error('Shared HTTP transport is not configured. Call configureSharedFetch from the host application before making requests.')
  }

  return fetcher<T>(url, options)
}

export type ErrorType<_Error> = BaseApiException

export type BodyType<BodyData> = BodyData
