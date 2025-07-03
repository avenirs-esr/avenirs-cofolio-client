import { PageSizes } from '@/ui/config'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PageSizes.FOUR

export const useAmsStore = defineStore('ams', () => {
  const pageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const currentPage = ref(0)

  return {
    currentPage,
    pageSizeSelected
  }
}, {
  persist: true
})
