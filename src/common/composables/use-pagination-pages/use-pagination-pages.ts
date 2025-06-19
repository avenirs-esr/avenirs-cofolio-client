export function usePaginationPages (totalPages: number) {
  return Array.from({ length: totalPages }, (_, index) => {
    const pageNum = index + 1
    return {
      title: `${pageNum}`,
      label: `${pageNum}`,
      href: `#page-${pageNum}`,
    }
  })
}
