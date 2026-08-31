import { type DeclaredActivityViewDTO, type PageInfoDTO, useGetDeclaredActivitiesView } from '@/api/avenir-esr'
import { useInfiniteScrollPagination } from '@/common/composables'
import { type ComputedRef, type Ref, toValue } from 'vue'

export interface UsePaginatedLibraryActivitiesResult {
  activities: Ref<DeclaredActivityViewDTO[]>
  pageInfo: Ref<PageInfoDTO | undefined>
  page: Ref<number>
  isFetching: Ref<boolean>
  loadMoreActivities: () => void
  resetPagination: () => void
  hasMoreActivities: ComputedRef<boolean>
}

export function usePaginatedLibraryActivities (
  { enabled, pageSize }: { enabled?: ComputedRef<boolean>, pageSize?: Ref<number> } = {}
): UsePaginatedLibraryActivitiesResult {
  const page = ref(0)

  const queryParams = computed(() => ({
    page: toValue(page),
    pageSize: toValue(pageSize) ?? 10,
  }))

  const {
    data,
    isFetching
  } = useGetDeclaredActivitiesView(queryParams, { query: { enabled } })

  const fetchedActivities = computed(() => data.value?.data ?? [])
  const fetchedPageInfo = computed(() => data.value?.page)

  const pageInfo = computed(() => fetchedPageInfo.value ?? { page: page.value, pageSize: 10, totalElements: 0, totalPages: 0 })

  const {
    items: activities,
    hasMoreItems: hasMoreActivities,
    loadMore: loadMoreActivities,
    resetPagination
  } = useInfiniteScrollPagination({
    fetchedItems: fetchedActivities,
    pageInfo,
    isFetching,
    page
  })

  return {
    activities,
    pageInfo,
    page,
    isFetching,
    hasMoreActivities,
    loadMoreActivities,
    resetPagination
  }
}
