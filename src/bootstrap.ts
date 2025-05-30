import tanstackQuery from '@/plugins/tanstack-query'
import i18nAvPlugin from '@/plugins/vue-i18n'
import router from '@/router'
import store from '@/store'
import { createApp } from 'vue'
import App from './App.vue'

import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'
import '@gouvminint/vue-dsfr/styles'
import '@gouvfr/dsfr/dist/scheme/scheme.min.css'
import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'
import '@/assets/main.css'
import '@/ui/styles/main.scss'

export function createVueApp () {
  const app = createApp(App)
  app.use(store)
  app.use(router)
  app.use(tanstackQuery)
  app.use(i18nAvPlugin)
  return app
}
