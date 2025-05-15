import en from '@/locales/en.json'
import fr from '@/locales/fr.json'
import { createI18n } from 'vue-i18n'

const messages = {
  fr,
  en
}

export const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages,
})
