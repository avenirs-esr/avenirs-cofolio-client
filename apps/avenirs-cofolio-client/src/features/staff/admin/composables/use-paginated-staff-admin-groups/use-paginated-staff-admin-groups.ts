import type { PageSizes } from '@avenirs-esr/avenirs-dsav'
import type { ComputedRef, Ref } from 'vue'
import type { EGroupType, GroupOverviewDTO, PageInfoDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { keepPreviousData } from '@tanstack/vue-query'
import { useGetGroups } from '@/api/avenir-esr'
import { usePagination } from '@/common/composables'

export interface UsePaginatedStaffAdminGroupsParams {
  currentPageRef: Ref<number>
  pageSizeRef: Ref<PageSizes>
  keywordRef: Ref<string | undefined>
  typesRef: Ref<EGroupType[] | undefined>
  enabledRef: Ref<boolean>
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

export function usePaginatedStaffAdminGroups ({
  currentPageRef,
  pageSizeRef,
  keywordRef,
  typesRef,
  enabledRef,
}: UsePaginatedStaffAdminGroupsParams): UsePaginatedStaffAdminGroupsResult {
  const { currentPage, pageSizeSelected, onUpdateCurrentPage, onUpdatePageSize } = usePagination(currentPageRef, pageSizeRef)

  const params = computed(() => ({
    page: currentPage.value,
    pageSize: pageSizeSelected.value,
    keyword: keywordRef.value,
    types: typesRef.value,
  }))

  const { data, error, isFetching } = useGetGroups(params, {
    query: { placeholderData: keepPreviousData, enabled: enabledRef.value }
  })

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
