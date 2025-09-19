import type { PageSizes } from '@avenirs-esr/avenirs-dsav'

export function createUsePaginationMock () {
  const currentPage = ref(0)
  const pageSizeSelected = ref(10)

  const onUpdateCurrentPage = vi.fn((page: number) => {
    currentPage.value = page
  })

  const onUpdatePageSize = vi.fn((size: PageSizes) => {
    pageSizeSelected.value = size
    currentPage.value = 0
  })

  return {
    currentPage,
    pageSizeSelected,
    onUpdateCurrentPage,
    onUpdatePageSize
  }
}
