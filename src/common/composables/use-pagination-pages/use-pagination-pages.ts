import type { Ref } from 'vue'

export function usePaginationPages (totalPages: Ref<number>) {
  return Array.from({ length: totalPages.value }, (_, index) => {
    const pageNum = index + 1
    return {
      title: `${pageNum}`,
      label: `${pageNum}`,
      href: `#page-${pageNum}`,
    }
  })
}
