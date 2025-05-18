import type { App } from 'vue'
import { AvAvailableLocales, type AvLocale } from '@/types/i18n.types'
import { createI18n } from 'vue-i18n'

const globalMessages = import.meta.glob<{ default: any }>('@/locales/*.json', { eager: true })

const messages: Partial<Record<AvLocale, any>> = {}

for (const [path, module] of Object.entries(globalMessages)) {
  const langMatch = path.match(/\/([a-z]{2})\.json$/)
  const lang = langMatch?.[1] as AvLocale | undefined

  if (lang && AvAvailableLocales.includes(lang)) {
    messages[lang] = (module as any).default ?? module
  }
}

const browserLocale: AvLocale = navigator.language.split('-')?.[0] as AvLocale
const locale: AvLocale = AvAvailableLocales.includes(browserLocale) ? browserLocale : 'fr'
const fallbackLocale: AvLocale = 'en'

const i18n = createI18n({
  locale,
  fallbackLocale,
  messages,
  legacy: false,
})

/**
 * Dynamically register feature-based locales
 */
async function registerFeatureLocales (feature: string) {
  for (const lang of AvAvailableLocales) {
    try {
      const module = await import(`@/features/${feature}/locales/${lang}.json`)
      i18n.global.mergeLocaleMessage(lang, {
        [feature]: module.default
      })
    }
    catch {
      console.warn(`No ${lang} locale found for feature ${feature}`)
    }
  }
}

export default {
  install (app: App) {
    app.use(i18n)
    registerFeatureLocales('student').then()
    registerFeatureLocales('teacher').then()
  }
}

export { i18n }
