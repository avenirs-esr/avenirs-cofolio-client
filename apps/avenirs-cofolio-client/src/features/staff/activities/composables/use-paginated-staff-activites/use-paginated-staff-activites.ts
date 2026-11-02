import type { PageSizes } from '@avenirs-esr/avenirs-dsav'
import type { BaseApiException } from '@avenirs-esr/shared'
import type { UseQueryOptions, UseQueryReturnType } from '@tanstack/vue-query'
import type { ComputedRef, MaybeRef, Ref } from 'vue'
import type { ActivityStaffOverviewDTO, PagedResponseActivityStaffOverviewDTO, PageInfoDTO } from '@/api/avenir-esr'
import { keepPreviousData } from '@tanstack/vue-query'
import { usePagination } from '@/common/composables'

type FetchFn = (
  params: MaybeRef<{ page: number, pageSize: PageSizes }>,
  options?: { query?: Partial<UseQueryOptions<PagedResponseActivityStaffOverviewDTO, BaseApiException>> }
) => UseQueryReturnType<PagedResponseActivityStaffOverviewDTO, BaseApiException>

export interface UsePaginatedStaffActivitiesParams {
  currentPageRef: Ref<number>
  pageSizeRef: Ref<PageSizes>
  fetchFn: FetchFn
}

export interface UsePaginatedStaffActivitiesResult {
  activities: ComputedRef<ActivityStaffOverviewDTO[]>
  pageInfo: ComputedRef<PageInfoDTO | undefined>
  isFetching: Ref<boolean>
  error: Ref<BaseApiException | null> | Ref<undefined>
  pageSizeSelected: Ref<PageSizes>
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (size: number) => void
}

export function usePaginatedStaffActivities ({ currentPageRef, pageSizeRef, fetchFn }: UsePaginatedStaffActivitiesParams): UsePaginatedStaffActivitiesResult {
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
