import type { App } from 'vue'
import { VueQueryPlugin, type VueQueryPluginOptions } from '@tanstack/vue-query'

export default {
  install (app: App) {
    const queryOptions: VueQueryPluginOptions = {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            retry: 3,
          },
          mutations: {
            retry: 2,
          },
        },
      },
    }

    app.use(VueQueryPlugin, queryOptions)
  },
}
