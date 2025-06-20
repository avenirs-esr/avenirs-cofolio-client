import { PageSizes } from '@/config'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PageSizes.EIGHT

export const useTracesStore = defineStore('traces', () => {
  const pageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const currentPage = ref(0)

  return {
    currentPage,
    pageSizeSelected
  }
}, {
  persist: true
})
