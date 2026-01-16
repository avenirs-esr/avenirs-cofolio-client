import type { App } from 'vue'
import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'

const DEFAULT_STALE_TIME = 2 * 60 * 1000

export default {
  install (app: App) {
    const queryOptions: VueQueryPluginOptions = {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: 3,
            staleTime: DEFAULT_STALE_TIME,
          },
          mutations: {
            retry: 1,
          },
        },
      },
    }

    app.use(VueQueryPlugin, queryOptions)
  },
}
