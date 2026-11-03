// @vitest-environment jsdom

import { getBrowserLocale, useLanguageSwitcher } from '#shared/index'
import { mountComposable } from '#shared/test-utils/mount-composable'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { useI18n } from 'vue-i18n'

BddTest().given('a useLanguageSwitcher composable', () => {
  function setup () {
    return { languageSwitcher: useLanguageSwitcher(), i18n: useI18n() }
  }

  let result: ReturnType<typeof setup>
  let unmount: () => void

  beforeEach(() => {
    vi.stubGlobal('navigator', { language: 'fr-FR' })
    const mounted = mountComposable(setup, { useI18n: true })
    result = mounted.result
    unmount = mounted.unmount
  })

  afterEach(() => {
    unmount?.()
    vi.unstubAllGlobals()
  })

  BddTest().when('initializing', () => {
    BddTest().then('it should initialize with the current browser language', () => {
      expect(result.languageSwitcher.languageSelector.value.currentLanguage).toBe(getBrowserLocale())
    })

    BddTest().then('it should preserve the available languages and translated title', () => {
      expect(result.languageSwitcher.languageSelector.value).toEqual({
        languages: [
          { label: 'Français', codeIso: 'fr' },
          { label: 'English', codeIso: 'en' },
        ],
        currentLanguage: 'fr',
        title: 'Changer de langue',
      })
    })
  })

  BddTest().when('selecting English', () => {
    beforeEach(() => {
      result.languageSwitcher.selectLanguage({ label: 'English', codeIso: 'en' })
    })

    BddTest().then('it should switch to English', () => {
      expect(result.languageSwitcher.languageSelector.value.currentLanguage).toBe('en')
    })

    BddTest().then('it should update the injected i18n locale', () => {
      expect(result.i18n.locale.value).toBe('en')
    })

    BddTest().then('it should update the translated title', async () => {
      await vi.waitFor(() => {
        expect(result.languageSwitcher.languageSelector.value.title).toBe('Change language')
      })
    })

    BddTest().and('selecting French again', () => {
      beforeEach(() => {
        result.languageSwitcher.selectLanguage({ label: 'Français', codeIso: 'fr' })
      })

      BddTest().then('it should restore French in the selector and i18n', async () => {
        expect(result.languageSwitcher.languageSelector.value.currentLanguage).toBe('fr')
        expect(result.i18n.locale.value).toBe('fr')
        await vi.waitFor(() => {
          expect(result.languageSwitcher.languageSelector.value.title).toBe('Changer de langue')
        })
      })
    })
  })

  BddTest().when('the injected i18n locale changes externally', () => {
    beforeEach(() => {
      result.i18n.locale.value = 'en'
    })

    BddTest().then('it should translate the title without changing the selected language', async () => {
      await vi.waitFor(() => {
        expect(result.languageSwitcher.languageSelector.value.title).toBe('Change language')
      })
      expect(result.languageSwitcher.languageSelector.value.currentLanguage).toBe('fr')
    })
  })
})
