import type { PageInfoDTO } from '@/api/avenir-esr'
import type { ComputedRef, Ref } from 'vue'

/**
 * useInfiniteScrollPagination input parameters.
 */
export interface UseInfiniteScrollPaginationParams<T> {
  /** Reactive array of items fetched from the current page */
  fetchedItems: Ref<T[]>
  /** Reactive pagination info containing current page and total pages */
  pageInfo: Ref<PageInfoDTO>
  /** Indicates if data is currently being fetched */
  isFetching: Ref<boolean>
  /** Current page number (0-based) */
  page: Ref<number>
  /** Function to extract unique identifier from an item */
  getItemId: (item: T) => string
}

/**
 * useInfiniteScrollPagination returned result.
 */
export interface UseInfiniteScrollPaginationResult<T> {
  /** Array containing all accumulated items across pages */
  items: Ref<T[]>
  /** Method that loads the next page of items */
  loadMore: () => void
  /** Method that resets pagination and clears all items */
  resetPagination: () => void
  /** Indicates if there are more elements to load */
  hasMoreItems: ComputedRef<boolean>
}

/**
 * Vue composable to handle infinite scroll pagination.
 *
 * This method provides :
 * - a reactive state `items` that accumulates all loaded items across pages,
 * - a method `loadMore` that increments the page to fetch more items,
 * - a method `resetPagination` that clears items and resets to page 0.
 *
 * @template T - The type of items being paginated
 * @param {UseInfiniteScrollPaginationParams<T>} params - Configuration object containing :
 *  - `fetchedItems` (Ref<T[]>) : reactive array of items from current page,
 *  - `pageInfo` (Ref<PageInfoDTO>) : pagination metadata,
 *  - `isFetching` (Ref<boolean>) : loading state indicator,
 *  - `page` (Ref<number>) : current page number,
 *  - `getItemId` (function) : function to extract unique item identifier.
 * @returns {UseInfiniteScrollPaginationResult<T>} Object containing :
 *  - `items` (Ref<T[]>) : accumulated items from all loaded pages,
 *  - `loadMore` (function) : method that loads the next page,
 *  - `resetPagination` (function) : method that resets pagination state
 *  - `hasMoreItems` (ComputedRef<boolean>) : indicates if more items can be loaded
 */
export function useInfiniteScrollPagination<T> ({
  fetchedItems,
  pageInfo,
  isFetching,
  page,
  getItemId
}: UseInfiniteScrollPaginationParams<T>): UseInfiniteScrollPaginationResult<T> {
  const items = ref<T[]>([]) as Ref<T[]>

  watch(fetchedItems, (newItems) => {
    if (pageInfo.value.page === 0) {
      items.value = newItems
    }
    else {
      const existingIds = new Set(items.value.map(item => getItemId(item)))
      const merged = [...items.value]

      newItems.forEach((item) => {
        if (!existingIds.has(getItemId(item))) {
          merged.push(item)
        }
      })

      items.value = merged
    }
  }, { immediate: true })

  const hasMoreItems = computed(() => page.value < pageInfo.value.totalPages - 1)

  function loadMore () {
    if (isFetching.value) {
      return
    }
    if (hasMoreItems.value) {
      page.value += 1
    }
  }

  function resetPagination () {
    page.value = 0
    items.value = []
  }

  return {
    items,
    hasMoreItems,
    loadMore,
    resetPagination
  }
}
