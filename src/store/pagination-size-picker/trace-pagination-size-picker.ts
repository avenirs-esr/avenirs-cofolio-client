import { PAGE_SIZES, type PageSize } from '@/config'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PAGE_SIZES[0]

export const useTracePaginationSizePicker = defineStore('tracePaginationSizePicker', () => {
  const pageSizeSelected = ref<PageSize>(DEFAULT_PAGE_SIZE)

  return {
    pageSizeSelected
  }
}, {
  persist: true
})
