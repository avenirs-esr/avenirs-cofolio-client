import type { BaseApiException } from '@avenirs-esr/shared'
import type { GetNationalToolsParams, PageInfoDTO, ToolDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { ComputedRef, Ref } from 'vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { usePagination } from '@avenirs-esr/shared'
import { useGetNationalTools } from '@avenirs-esr/shared/api/avenir-esr'
import { keepPreviousData } from '@tanstack/vue-query'
import { computed, toRef } from 'vue'

export interface UsePaginatedNationalToolsParams {
  currentPageRef: Ref<number>
}

export interface UsePaginatedNationalToolsResult {
  nationalTools: ComputedRef<ToolDTO[]>
  pageInfo: ComputedRef<PageInfoDTO | undefined>
  isFetching: Ref<boolean>
  error: Ref<BaseApiException | null> | Ref<undefined>
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (size: number) => void
}

export function usePaginatedNationalTools ({
  currentPageRef,
}: UsePaginatedNationalToolsParams): UsePaginatedNationalToolsResult {
  const {
    currentPage,
    onUpdateCurrentPage,
    onUpdatePageSize
  } = usePagination(currentPageRef, toRef(PageSizes.TWELVE))

  const params = computed<GetNationalToolsParams>(() => ({
    page: currentPage.value,
    pageSize: PageSizes.TWELVE,
  }))

  const { data, error, isFetching } = useGetNationalTools(params, {
    query: { placeholderData: keepPreviousData }
  })

  const nationalTools = computed(() => data.value?.data ?? [])
  const pageInfo = computed(() => data.value?.page)

  return {
    nationalTools,
    pageInfo,
    isFetching,
    error,
    onUpdateCurrentPage,
    onUpdatePageSize
  }
}
