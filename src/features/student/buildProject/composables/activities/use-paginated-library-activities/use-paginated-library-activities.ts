import type { DeclaredActivityViewDTO, PageInfoDTO } from '@/api/avenir-esr'
import { useInfiniteScrollPagination } from '@/common/composables'
import { useLibraryActivitiesQuery } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
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

export function usePaginatedLibraryActivities (enabled?: ComputedRef<boolean>): UsePaginatedLibraryActivitiesResult {
  const page = ref(0)
  const pageSize = ref(10)

  const queryParams = computed(() => ({
    page: toValue(page),
    pageSize: toValue(pageSize),
  }))

  const {
    pageInfo: fetchedPageInfo,
    libraryActivities: fetchedActivities,
    isFetching
  } = useLibraryActivitiesQuery(queryParams, enabled)

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
