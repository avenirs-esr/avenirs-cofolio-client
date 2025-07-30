import type { PageSizes } from '@/ui/config'
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

  watch(pageSizeSelected, () => {
    currentPage.value = 0
  }, { immediate: true })

  return {
    currentPage,
    pageSizeSelected,
    onUpdateCurrentPage,
    onUpdatePageSize,
  }
}
