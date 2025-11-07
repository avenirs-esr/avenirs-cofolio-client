import { getBrowserLocale, i18n } from '@/plugins/vue-i18n'
import { useUserStore } from '@/store/user/user'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student shared store', () => {
  let store: ReturnType<typeof useUserStore>

  beforeEach(() => {
    const { result } = mountComposable(useUserStore, { usePinia: true, useI18n: true })
    store = result
  })

  BddTest().when('the store is initialized', () => {
    BddTest().then('it should have language selector with default properties', () => {
      expect(store.languageSelector.id).toBe('language-selector')
      expect(store.languageSelector.languages).toHaveLength(2)
      expect(store.languageSelector.languages[0]).toEqual({ label: 'Français', codeIso: 'fr' })
      expect(store.languageSelector.languages[1]).toEqual({ label: 'English', codeIso: 'en' })
    })

    BddTest().then('it should initialize with the current browser language', () => {
      expect(store.languageSelector.currentLanguage).toBe(getBrowserLocale())
    })

    BddTest().then('it should have selectLanguage function', () => {
      expect(typeof store.selectLanguage).toBe('function')
    })
  })

  BddTest().when('selecting a language', () => {
    BddTest().then('it should update the current language to English', () => {
      store.selectLanguage({ label: 'English', codeIso: 'en' })
      expect(store.languageSelector.currentLanguage).toBe('en')
    })

    BddTest().then('it should update the current language to French', () => {
      store.selectLanguage({ label: 'Français', codeIso: 'fr' })
      expect(store.languageSelector.currentLanguage).toBe('fr')
    })

    BddTest().then('it should update i18n locale', () => {
      store.selectLanguage({ label: 'English', codeIso: 'en' })
      expect(i18n.global.locale.value).toBe('en')
    })
  })

  BddTest().when('switching between languages', () => {
    BddTest().then('it should persist language changes', () => {
      const initialLanguage = store.languageSelector.currentLanguage

      store.selectLanguage({ label: 'English', codeIso: 'en' })
      expect(store.languageSelector.currentLanguage).toBe('en')

      store.selectLanguage({ label: 'Français', codeIso: 'fr' })
      expect(store.languageSelector.currentLanguage).toBe('fr')

      if (initialLanguage === 'en') {
        store.selectLanguage({ label: 'English', codeIso: 'en' })
        expect(store.languageSelector.currentLanguage).toBe('en')
      }
    })
  })
})
