import type { AvLocale } from '@avenirs-esr/shared'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { AvAvailableLocales, AvIsoLocaleMap } from '@avenirs-esr/shared'
import { afterEach, expect, vi } from 'vitest'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

BddTest().given('the shared runtime constants', () => {
  BddTest().when('the locale public entry point is imported', () => {
    BddTest().then('it preserves locale order and the exact ISO mapping', () => {
      const locales: readonly AvLocale[] = AvAvailableLocales
      const mapping: Record<AvLocale, string> = AvIsoLocaleMap
      expect(locales).toEqual(['en', 'fr'])
      expect(Object.keys(mapping)).toEqual(['en', 'fr'])
      expect(mapping).toEqual({ en: 'en-US', fr: 'fr-FR' })
    })
  })
})
