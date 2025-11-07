import { useLanguageSwitcher } from '@/common/composables'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
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
