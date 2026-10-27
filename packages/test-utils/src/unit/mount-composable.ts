import type { QueryClientConfig } from '@tanstack/vue-query'
import type { Pinia } from 'pinia'
import type { Plugin } from 'vue'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia, setActivePinia } from 'pinia'
import { createApp } from 'vue'

export interface MountComposableOptions {
  useTanstack?: boolean
  useI18n?: boolean
  usePinia?: boolean
  queryClientConfig?: QueryClientConfig
}

export interface MountComposableDependencies {
  i18n: Plugin
  createTestPinia?: () => Pinia
}

const defaultQueryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
}

export function createMountComposable ({
  i18n,
  createTestPinia = createPinia,
}: MountComposableDependencies) {
  return function mountComposable<T> (
    fn: () => T,
    {
      useTanstack = false,
      useI18n = false,
      usePinia = false,
      queryClientConfig = defaultQueryClientConfig,
    }: MountComposableOptions,
  ): { result: T, unmount: () => void } {
    let composableResult: T | undefined
    const app = createApp({
      setup () {
        composableResult = fn()
        return () => null
      },
    })

    if (useI18n) {
      app.use(i18n)
    }

    if (usePinia) {
      const pinia = createTestPinia()
      setActivePinia(pinia)
      app.use(pinia)
    }

    if (useTanstack) {
      const queryClient = new QueryClient(queryClientConfig)
      app.use(VueQueryPlugin, { queryClient })
    }

    app.mount(document.createElement('div'))

    return {
      result: composableResult as T,
      unmount: () => app.unmount(),
    }
  }
}
