import type { Page } from '@gouvminint/vue-dsfr'
import type { Ref } from 'vue'

export function getPaginationPages (totalPages: Ref<number>): Page[] {
  return Array.from({ length: totalPages.value }, (_, index) => {
    const pageNum = index + 1
    return {
      title: `${pageNum}`,
      label: `${pageNum}`,
      href: `#page-${pageNum}`,
    }
  })
}
