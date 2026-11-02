import type { PageSizes } from '@avenirs-esr/avenirs-dsav'
import type { BaseApiException } from '@avenirs-esr/shared'
import type { ComputedRef, Ref } from 'vue'
import type { EUserCategory, ExternalUserAffiliationOverviewDTO, GetAffiliationsParams, PageInfoDTO } from '@/api/avenir-esr'
import { keepPreviousData } from '@tanstack/vue-query'
import { useGetAffiliations } from '@/api/avenir-esr'
import { usePagination } from '@/common/composables'

export interface UsePaginatedAffiliationsParams {
  pageRef: Ref<number>
  pageSizeRef: Ref<PageSizes>
  keywordRef: Ref<string | undefined>
  categoriesRef: Ref<EUserCategory[] | undefined>
  institutionIdsRef: Ref<string[] | undefined>
  groupIdsRef: Ref<string[] | undefined>
}

export interface UsePaginatedAffiliationsResult {
  users: ComputedRef<ExternalUserAffiliationOverviewDTO[]>
  pageInfo: ComputedRef<PageInfoDTO | undefined>
  isFetching: Ref<boolean>
  error: Ref<BaseApiException | null> | Ref<undefined>
  pageSizeSelected: Ref<PageSizes>
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (size: number) => void
}

export function usePaginatedAffiliations ({
  pageRef,
  pageSizeRef,
  keywordRef,
  categoriesRef,
  institutionIdsRef,
  groupIdsRef,
}: UsePaginatedAffiliationsParams): UsePaginatedAffiliationsResult {
  const { currentPage, pageSizeSelected, onUpdateCurrentPage, onUpdatePageSize } = usePagination(pageRef, pageSizeRef)

  const params = computed<GetAffiliationsParams>(() => ({
    page: currentPage.value,
    pageSize: pageSizeSelected.value,
    keyword: keywordRef.value,
    categories: categoriesRef.value,
    institutionIds: institutionIdsRef.value,
    groupIds: groupIdsRef.value,
  }))

  const { data, error, isFetching } = useGetAffiliations(params, {
    query: { placeholderData: keepPreviousData }
  })

  const users = computed(() => data.value?.data ?? [])
  const pageInfo = computed(() => data.value?.page)

  return {
    users,
    pageInfo,
    isFetching,
    error,
    pageSizeSelected,
    onUpdateCurrentPage,
    onUpdatePageSize
  }
}
