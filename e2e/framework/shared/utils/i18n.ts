import type { Page } from '@playwright/test'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createI18n } from 'vue-i18n'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

type LocaleMessages = Record<string, unknown>
type AvLocale = 'fr' | 'en'

const AvAvailableLocales: readonly AvLocale[] = ['fr', 'en'] as const

function getDefaultLocale (): AvLocale {
  return 'fr'
}

function normalizeLocale (locale: string): AvLocale {
  const lang = locale.split('-')[0].toLowerCase()
  return (AvAvailableLocales as readonly string[]).includes(lang) ? lang as AvLocale : getDefaultLocale()
}

function deepMerge (target: LocaleMessages, source: LocaleMessages): LocaleMessages {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge((result[key] as LocaleMessages) || {}, source[key] as LocaleMessages)
    }
    else {
      result[key] = source[key]
    }
  }
  return result
}

function findLocaleFiles (baseDir: string): string[] {
  const results: string[] = []

  function walkDir (dir: string) {
    if (!fs.existsSync(dir)) {
      return
    }

    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        walkDir(filePath)
      }
      else if (file.match(/^[a-z]{2}\.json$/)) {
        results.push(filePath)
      }
    }
  }

  walkDir(baseDir)
  return results
}

function loadLocaleMessages () {
  const messages = {
    fr: {},
    en: {}
  }

  const srcDir = path.resolve(__dirname, '../../../../src')
  const globalLocalesDir = path.join(srcDir, 'locales')
  for (const locale of AvAvailableLocales as readonly AvLocale[]) {
    const globalFile = path.join(globalLocalesDir, `${locale}.json`)
    if (fs.existsSync(globalFile)) {
      const content = JSON.parse(fs.readFileSync(globalFile, 'utf-8'))
      messages[locale] = deepMerge(messages[locale], content)
    }
  }

  const featuresDir = path.join(srcDir, 'features')
  const localeFiles = findLocaleFiles(featuresDir)
  for (const filePath of localeFiles) {
    const langMatch = filePath.match(/([a-z]{2})\.json$/)
    const lang = langMatch?.[1]

    if (lang && (AvAvailableLocales as readonly string[]).includes(lang)) {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      messages[lang as AvLocale] = deepMerge(messages[lang as AvLocale], content)
    }
  }

  return messages
}

const messages = loadLocaleMessages()

const i18n = createI18n({
  locale: getDefaultLocale(),
  fallbackLocale: getDefaultLocale(),
  messages,
  legacy: false
})

export const t = i18n.global.t

export function setLocale (locale: AvLocale) {
  i18n.global.locale.value = locale
}

export async function setLocaleFromPage (page: Page) {
  const contextLocale = await page.evaluate(() => navigator.language)
  const normalizedLocale = normalizeLocale(contextLocale)
  setLocale(normalizedLocale)
}
