import tanstackQuery from '@/plugins/tanstack-query'
import router from '@/router'
import store from '@/store'
import { createApp } from 'vue'

import App from './App.vue'
import { i18n } from './i18n'

import '@gouvfr/dsfr/dist/core/core.main.min.css'
import '@gouvfr/dsfr/dist/component/component.main.min.css'
import '@gouvfr/dsfr/dist/utility/utility.main.min.css'

import '@gouvminint/vue-dsfr/styles'
import '@gouvfr/dsfr/dist/scheme/scheme.min.css'

import '@gouvfr/dsfr/dist/utility/icons/icons.min.css'
import '@/assets/main.css'
import '@/ui/styles/main.scss'

createApp(App)
  .use(store)
  .use(router)
  .use(tanstackQuery)
  .use(i18n)
  .mount('#app')
