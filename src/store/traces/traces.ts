import { useDrawer } from '@/common/composables'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PageSizes.EIGHT

export const useTracesStore = defineStore('traces', () => {
  const pageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const currentPage = ref(0)

  const { showDrawer: showCreateTraceDrawer, displayDrawer: displayCreateTraceDrawer, hideDrawer: hideCreateTraceDrawer } = useDrawer()

  return {
    currentPage,
    pageSizeSelected,
    showCreateTraceDrawer,
    displayCreateTraceDrawer,
    hideCreateTraceDrawer
  }
}, {
  persist: true
})
