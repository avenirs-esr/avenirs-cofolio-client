import type { Page } from '@gouvminint/vue-dsfr'
import type { Ref } from 'vue'

/**
 * Generates an array of pages for pagination based on the total number of pages.
 *
 * Each page is an object containing:
 * - `title`: The page number as a string.
 * - `label`: The label displayed for the page (same as the number).
 * - `href`: An anchor identifier to the page, formatted as `#page-x`.
 *
 * @param {Ref<number>} totalPages - Reactive reference to the total number of pages.
 * @returns {Page[]} Array of page objects to use for pagination.
 */
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
