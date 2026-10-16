import { defineStore } from 'pinia'
import { useLanguageSwitcher } from '@/common/composables'

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
