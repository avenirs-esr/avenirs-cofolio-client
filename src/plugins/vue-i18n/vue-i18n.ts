import type { App } from 'vue'
import { AvAvailableLocales, type AvLocale } from '@/types/i18n.types'
import { createI18n } from 'vue-i18n'

export function parseLocaleModules (modules: Record<string, any>) {
  const result: Partial<Record<AvLocale, any>> = {}

  for (const [path, module] of Object.entries(modules)) {
    const langMatch = path.match(/\/([a-z]{2})\.json$/)
    const lang = langMatch?.[1] as AvLocale | undefined

    if (lang && AvAvailableLocales.includes(lang)) {
      result[lang] = (module as any).default ?? module
    }
  }

  return result
}

export function getBrowserLocale (): AvLocale {
  const browserLocale = navigator.language.split('-')?.[0] as AvLocale
  return AvAvailableLocales.includes(browserLocale) ? browserLocale : 'fr'
}

const globalMessages = import.meta.glob<{ default: any }>('@/locales/*.json', { eager: true })
const messages = parseLocaleModules(globalMessages)

const locale = getBrowserLocale()
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
      i18n.global.mergeLocaleMessage(lang, module.default)
    }
    catch {
      console.warn(`No ${lang} locale found for feature ${feature}`)
    }
  }
}

function createVueI18nPlugin (registerFn = registerFeatureLocales) {
  return {
    install (app: App) {
      app.use(i18n)
      registerFn('student').then()
      registerFn('teacher').then()
    }
  }
}

export default createVueI18nPlugin()

export { createVueI18nPlugin, i18n, registerFeatureLocales }
