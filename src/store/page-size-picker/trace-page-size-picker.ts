import { PAGE_SIZE, type PageSize } from '@/config'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PAGE_SIZE[0]

export const useTracePageSizePicker = defineStore('tracePageSizePicker', () => {
  const pageSize = ref<PageSize>(DEFAULT_PAGE_SIZE)

  return {
    pageSize
  }
}, {
  persist: true
})
