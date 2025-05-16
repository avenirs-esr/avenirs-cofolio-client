import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import { createI18n } from 'vue-i18n'

const browserLocale = navigator.language.split('-')[0] || 'fr'
const locale = ['fr', 'en'].includes(browserLocale) ? browserLocale : 'fr'

const messages = {
  fr,
  en
}

export const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages,
})
