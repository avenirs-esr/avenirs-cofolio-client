import { PageSizes } from '@/config'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PageSizes.FOUR

export const useTracePaginationSizePicker = defineStore('tracePaginationSizePicker', () => {
  const pageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)

  return {
    pageSizeSelected
  }
}, {
  persist: true
})
