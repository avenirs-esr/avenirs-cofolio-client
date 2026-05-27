import type { App } from 'vue'
import { ROUTES } from '@/common/constants'
import { BaseApiException } from '@/common/exceptions'
import router from '@/router'
import { type DefaultError, MutationCache, QueryCache, VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'

function handleError (error: DefaultError): void {
  if (typeof window !== 'undefined' && error instanceof BaseApiException && error.status === 401) {
    router.push({
      name: ROUTES.AUTH.LOGIN.name,
      query: { redirect: router.currentRoute.value.fullPath },
    })
  }
}

function handleRetry (retryLimit: number) {
  return (failureCount: number, error: unknown): boolean => {
    if (error instanceof BaseApiException && error.status === 401) {
      return false
    }
    return failureCount < retryLimit
  }
}

export default {
  install (app: App) {
    const queryOptions: VueQueryPluginOptions = {
      queryClientConfig: {
        queryCache: new QueryCache({ onError: handleError }),
        mutationCache: new MutationCache({ onError: handleError }),
        defaultOptions: {
          queries: { retry: handleRetry(2) },
          mutations: { retry: handleRetry(1) },
        },
      },
    }

    app.use(VueQueryPlugin, queryOptions)
  },
}
