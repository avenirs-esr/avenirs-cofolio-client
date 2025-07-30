import { PageSizes } from '@/ui/config'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PageSizes.FOUR

export const useSkillsStore = defineStore('skills', () => {
  const pageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const currentPage = ref(0)

  const additionalPageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const additionalCurrentPage = ref(0)

  return {
    currentPage,
    pageSizeSelected,
    additionalCurrentPage,
    additionalPageSizeSelected
  }
}, {
  persist: true
})
