import type { DsfrLanguageSelectorElement } from '@gouvminint/vue-dsfr'
import { useI18n } from 'vue-i18n'

export function useLanguageSwitcher () {
  const { locale } = useI18n()
  const languageSelector = ref({
    id: 'language-selector',
    languages: [
      { label: 'Français', codeIso: 'fr' },
      { label: 'English', codeIso: 'en' },
    ],
    currentLanguage: 'fr',
  })

  function selectLanguage (language: DsfrLanguageSelectorElement) {
    languageSelector.value.currentLanguage = language.codeIso
    locale.value = language.codeIso
  }

  return {
    languageSelector,
    selectLanguage,
  }
}
