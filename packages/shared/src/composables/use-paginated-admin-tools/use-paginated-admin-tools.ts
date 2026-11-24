import type { GetLocalToolsParams, GetNationalToolsParams, PageInfoDTO, ToolDTO } from '#shared/api/avenir-esr'
import type { BaseApiException } from '#shared/exceptions'
import type { ComputedRef, Ref } from 'vue'
import { EToolType, useGetLocalTools, useGetNationalTools } from '#shared/api/avenir-esr'
import { usePagination } from '#shared/composables/use-pagination/use-pagination'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData } from '@tanstack/vue-query'
import { computed, toRef } from 'vue'

export interface UsePaginatedAdminToolsParams {
  currentPageRef: Ref<number>
  typeRef: Ref<EToolType | undefined>
}

export interface UsePaginatedAdminToolsResult {
  tools: ComputedRef<ToolDTO[]>
  pageInfo: ComputedRef<PageInfoDTO | undefined>
  isFetching: Ref<boolean>
  error: Ref<BaseApiException | null> | Ref<undefined>
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (size: number) => void
}

export function usePaginatedAdminTools ({
  currentPageRef,
  typeRef,
}: UsePaginatedAdminToolsParams): UsePaginatedAdminToolsResult {
  const {
    currentPage,
    onUpdateCurrentPage,
    onUpdatePageSize
  } = usePagination(currentPageRef, toRef(PageSizes.TWELVE))

  const isNational = computed(() => !typeRef.value || typeRef.value === EToolType.NATIONAL)

  const nationalParams = computed<GetNationalToolsParams>(() => ({
    page: currentPage.value,
    pageSize: PageSizes.TWELVE,
  }))

  const localParams = computed<GetLocalToolsParams>(() => ({
    page: currentPage.value,
    pageSize: PageSizes.TWELVE,
    type: typeRef.value,
  }))

  const {
    data: nationalData,
    error: nationalError,
    isFetching: isNationalFetching
  } = useGetNationalTools(nationalParams, {
    query: {
      enabled: isNational,
      placeholderData: keepPreviousData
    }
  })

  const {
    data: localData,
    error: localError,
    isFetching: isLocalFetching
  } = useGetLocalTools(localParams, {
    query: {
      enabled: computed(() => !isNational.value),
      placeholderData: keepPreviousData
    }
  })

  const tools = computed(() => (isNational.value ? nationalData.value?.data : localData.value?.data) ?? [])
  const pageInfo = computed(() => (isNational.value ? nationalData.value?.page : localData.value?.page))
  const isFetching = computed(() => isNational.value ? isNationalFetching.value : isLocalFetching.value)
  const error = computed(() => isNational.value ? nationalError.value : localError.value)

  return {
    tools,
    pageInfo,
    isFetching,
    error,
    onUpdateCurrentPage,
    onUpdatePageSize
  }
}
