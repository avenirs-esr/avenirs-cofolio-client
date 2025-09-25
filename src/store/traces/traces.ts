import { useDrawer } from '@/common/composables'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { defineStore } from 'pinia'

const DEFAULT_PAGE_SIZE = PageSizes.EIGHT

export const useTracesStore = defineStore('traces', () => {
  const unassociatedPageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const unassociatedCurrentPage = ref(0)
  const associatedPageSizeSelected = ref<PageSizes>(DEFAULT_PAGE_SIZE)
  const associatedCurrentPage = ref(0)

  const { showDrawer: showCreateTraceDrawer, displayDrawer: displayCreateTraceDrawer, hideDrawer: hideCreateTraceDrawer } = useDrawer()

  return {
    unassociatedCurrentPage,
    unassociatedPageSizeSelected,
    associatedCurrentPage,
    associatedPageSizeSelected,
    showCreateTraceDrawer,
    displayCreateTraceDrawer,
    hideCreateTraceDrawer
  }
}, {
  persist: true
})
