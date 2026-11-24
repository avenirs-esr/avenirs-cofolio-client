import type { BaseApiException } from '@avenirs-esr/shared'
import type { EToolType, GetLocalToolsParams, PageInfoDTO, ToolDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { ComputedRef, Ref } from 'vue'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { usePagination } from '@avenirs-esr/shared'
import { useGetLocalTools } from '@avenirs-esr/shared/api/avenir-esr'
import { keepPreviousData } from '@tanstack/vue-query'

export interface UsePaginatedLocalToolsParams {
  currentPageRef: Ref<number>
  typeRef: Ref<EToolType>
}

export interface UsePaginatedLocalToolsResult {
  localTools: ComputedRef<ToolDTO[]>
  pageInfo: ComputedRef<PageInfoDTO | undefined>
  isFetching: Ref<boolean>
  error: Ref<BaseApiException | null> | Ref<undefined>
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (size: number) => void
}

export function usePaginatedLocalTools ({
  currentPageRef,
  typeRef,
}: UsePaginatedLocalToolsParams): UsePaginatedLocalToolsResult {
  const {
    currentPage,
    onUpdateCurrentPage,
    onUpdatePageSize
  } = usePagination(currentPageRef, toRef(PageSizes.TWELVE))

  const params = computed<GetLocalToolsParams>(() => ({
    page: currentPage.value,
    pageSize: PageSizes.TWELVE,
    type: typeRef.value
  }))

  const { data, error, isFetching } = useGetLocalTools(params, {
    query: { placeholderData: keepPreviousData }
  })

  const localTools = computed(() => data.value?.data ?? [])
  const pageInfo = computed(() => data.value?.page)

  return {
    localTools,
    pageInfo,
    isFetching,
    error,
    onUpdateCurrentPage,
    onUpdatePageSize
  }
}
