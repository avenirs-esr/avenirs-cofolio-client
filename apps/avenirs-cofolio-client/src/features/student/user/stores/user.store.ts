import { useLanguageSwitcher } from '@avenirs-esr/shared'
import { defineStore } from 'pinia'

export const useStudentUserStore = defineStore('studentUser', () => {
  const { languageSelector, selectLanguage } = useLanguageSwitcher()

  return {
    languageSelector,
    selectLanguage
  }
}, {
  persist: {
    pick: [
      'languageSelector.currentLanguage',
    ]
  }
})
