import type { AvLocale } from '@/types'
import type { DsfrLanguageSelectorElement } from '@gouvminint/vue-dsfr'
import { getBrowserLocale } from '@/plugins/vue-i18n'
import { useI18n } from 'vue-i18n'

export function useLanguageSwitcher () {
  const { locale } = useI18n()
  const languageSelector = ref({
    id: 'language-selector',
    languages: [
      { label: 'Français', codeIso: 'fr' },
      { label: 'English', codeIso: 'en' },
    ],
    currentLanguage: getBrowserLocale(),
  })

  function selectLanguage (language: DsfrLanguageSelectorElement) {
    languageSelector.value.currentLanguage = language.codeIso as AvLocale
    locale.value = language.codeIso
  }

  return {
    languageSelector,
    selectLanguage,
  }
}
