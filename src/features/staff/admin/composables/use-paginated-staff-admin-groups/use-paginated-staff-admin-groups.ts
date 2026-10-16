import type { EFeedbackStatus, GroupOverviewDTO, PagedResponseGroupOverviewDTO, PageInfoDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { PageSizes } from '@avenirs-esr/avenirs-dsav'
import type { ComputedRef, MaybeRef, Ref } from 'vue'
import { usePagination } from '@/common/composables'
import { keepPreviousData, type UseQueryOptions, type UseQueryReturnType } from '@tanstack/vue-query'

type FetchFn = (
  params: MaybeRef<{ page: number, pageSize: PageSizes, status?: EFeedbackStatus }>,
  options?: { query?: Partial<UseQueryOptions<PagedResponseGroupOverviewDTO, BaseApiException>> }
) => UseQueryReturnType<PagedResponseGroupOverviewDTO, BaseApiException>

export interface UsePaginatedStaffAdminGroupsParams {
  currentPageRef: Ref<number>
  pageSizeRef: Ref<PageSizes>
  fetchFn: FetchFn
}

export interface UsePaginatedStaffAdminGroupsResult {
  groups: ComputedRef<GroupOverviewDTO[]>
  pageInfo: ComputedRef<PageInfoDTO | undefined>
  isFetching: Ref<boolean>
  error: Ref<BaseApiException | null> | Ref<undefined>
  pageSizeSelected: Ref<PageSizes>
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (size: number) => void
}

export function usePaginatedStaffAdminGroups ({ currentPageRef, pageSizeRef, fetchFn }: UsePaginatedStaffAdminGroupsParams): UsePaginatedStaffAdminGroupsResult {
  const { currentPage, pageSizeSelected, onUpdateCurrentPage, onUpdatePageSize } = usePagination(currentPageRef, pageSizeRef)

  const params = computed(() => ({
    page: currentPage.value,
    pageSize: pageSizeSelected.value,
  }))
  const { data, error, isFetching } = fetchFn(params, { query: { placeholderData: keepPreviousData } })

  const groups = computed(() => data.value?.data ?? [])
  const pageInfo = computed(() => data.value?.page)

  return {
    groups,
    pageInfo,
    isFetching,
    error,
    pageSizeSelected,
    onUpdateCurrentPage,
    onUpdatePageSize
  }
}
