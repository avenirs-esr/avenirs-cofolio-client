import type { ActivityStaffOverviewDTO, PagedResponseActivityStaffOverviewDTO, PageInfoDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { PageSizes } from '@avenirs-esr/avenirs-dsav'
import type { ComputedRef, MaybeRef, Ref } from 'vue'
import { usePagination } from '@/common/composables'
import { keepPreviousData, type UseQueryOptions, type UseQueryReturnType } from '@tanstack/vue-query'

type FetchFn = (
  params: MaybeRef<{ page: number, pageSize: PageSizes }>,
  options?: { query?: Partial<UseQueryOptions<PagedResponseActivityStaffOverviewDTO, BaseApiException>> }
) => UseQueryReturnType<PagedResponseActivityStaffOverviewDTO, BaseApiException>

export interface UsePaginatedStaffActivitesParams {
  currentPageRef: Ref<number>
  pageSizeRef: Ref<PageSizes>
  fetchFn: FetchFn
}

export interface UsePaginatedStaffActivitesResult {
  activities: ComputedRef<ActivityStaffOverviewDTO[]>
  pageInfo: ComputedRef<PageInfoDTO | undefined>
  isFetching: Ref<boolean>
  error: Ref<BaseApiException | null> | Ref<undefined>
  pageSizeSelected: Ref<PageSizes>
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (size: number) => void
}

export function usePaginatedStaffActivites ({ currentPageRef, pageSizeRef, fetchFn }: UsePaginatedStaffActivitesParams): UsePaginatedStaffActivitesResult {
  const { currentPage, pageSizeSelected, onUpdateCurrentPage, onUpdatePageSize } = usePagination(currentPageRef, pageSizeRef)

  const params = computed(() => ({ page: currentPage.value, pageSize: pageSizeSelected.value }))
  const { data, error, isFetching } = fetchFn(params, { query: { placeholderData: keepPreviousData } })

  const activities = computed(() => data.value?.data ?? [])
  const pageInfo = computed(() => data.value?.page)

  return {
    activities,
    pageInfo,
    isFetching,
    error,
    pageSizeSelected,
    onUpdateCurrentPage,
    onUpdatePageSize
  }
}
