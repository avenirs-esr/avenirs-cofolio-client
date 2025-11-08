import { useLanguageSwitcher } from '@/common/composables'
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
      'languageSelector',
    ]
  }
})
