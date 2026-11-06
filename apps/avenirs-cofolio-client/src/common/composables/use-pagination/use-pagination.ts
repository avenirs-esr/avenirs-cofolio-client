import type { PageSizes } from '@avenirs-esr/avenirs-dsav'
import type { Ref } from 'vue'

export function usePagination (storeCurrentPage: Ref<number>, storePageSizeSelected: Ref<PageSizes>, totalPages?: Ref<number>) {
  const currentPage = toRef(storeCurrentPage)
  const pageSizeSelected = toRef(storePageSizeSelected)
  const totalPageCount = toRef(totalPages)

  function onUpdateCurrentPage (pageNumber: number) {
    currentPage.value = pageNumber
  }

  function onUpdatePageSize (pageSize: PageSizes) {
    pageSizeSelected.value = pageSize
  }

  function resetCurrentPage () {
    currentPage.value = 0
  }

  watch(totalPageCount, (pages) => {
    if (pages) {
      const lastValidIndex = Math.max(0, pages - 1)
      if (currentPage.value > lastValidIndex) {
        currentPage.value = lastValidIndex
      }
    }
  })

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
