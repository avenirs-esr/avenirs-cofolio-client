import type { GetNationalToolsParams, PageInfoDTO, ToolDTO } from '#shared/api/avenir-esr'
import type { BaseApiException } from '#shared/exceptions'
import type { ComputedRef, Ref } from 'vue'
import { useGetNationalTools } from '#shared/api/avenir-esr'
import { usePagination } from '#shared/composables/use-pagination/use-pagination'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
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
