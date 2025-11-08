import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PageSizes.FOUR

export const useSkillsStore = defineStore('skills', () => {
  const pageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const currentPage = ref(0)

  return {
    currentPage,
    pageSizeSelected
  }
}, {
  persist: {
    pick: [
      'currentPage',
      'pageSizeSelected'
    ]
  }
})
