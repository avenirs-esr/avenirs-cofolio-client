import type { PageSizes } from '@avenirs-esr/avenirs-dsav'
import type { Ref } from 'vue'

export function usePagination (storeCurrentPage: Ref<number>, storePageSizeSelected: Ref<PageSizes>) {
  const currentPage = toRef(storeCurrentPage)
  const pageSizeSelected = toRef(storePageSizeSelected)

  function onUpdateCurrentPage (pageNumber: number) {
    currentPage.value = pageNumber
  }

  function onUpdatePageSize (pageSize: PageSizes) {
    pageSizeSelected.value = pageSize
  }

  function resetCurrentPage () {
    currentPage.value = 0
  }

  watch(pageSizeSelected, () => {
    resetCurrentPage()
  }, { immediate: true })

  return {
    currentPage,
    pageSizeSelected,
    onUpdateCurrentPage,
    onUpdatePageSize,
    resetCurrentPage
  }
}
