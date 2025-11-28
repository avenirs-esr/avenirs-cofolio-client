import App from '@/App.vue'
import tanstackQuery from '@/plugins/tanstack-query/tanstack-query'
import i18nAvPlugin, { initializeI18n } from '@/plugins/vue-i18n/vue-i18n'
import router from '@/router'
import store from '@/store'
import { createApp } from 'vue'

import '@avenirs-esr/avenirs-dsav/style.css'
import '@/assets/main.css'

/* these are necessary styles for vue flow */
import '@vue-flow/core/dist/style.css'
/* this contains the default theme, these are optional styles */
import '@vue-flow/core/dist/theme-default.css'

export async function createVueApp () {
  await initializeI18n()

  const app = createApp(App)
  app.use(store)
  app.use(router)
  app.use(tanstackQuery)
  app.use(i18nAvPlugin)
  return app
}
