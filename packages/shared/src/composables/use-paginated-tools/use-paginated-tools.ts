import type { GetAvailableToolsParams, GetLocalToolsParams, GetNationalToolsParams, PageInfoDTO, ToolDTO } from '#shared/api/avenir-esr'
import type { BaseApiException } from '#shared/exceptions'
import type { ComputedRef, Ref } from 'vue'
import { EToolType, useGetAvailableTools, useGetLocalTools, useGetNationalTools } from '#shared/api/avenir-esr'
import { usePagination } from '#shared/composables/use-pagination/use-pagination'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData } from '@tanstack/vue-query'
import { computed, toRef } from 'vue'

export interface UsePaginatedToolsParams {
  currentPageRef: Ref<number>
  pageSizeRef?: Ref<number>
  typeRef: Ref<EToolType | undefined>
  previewModeRef?: Ref<boolean>
  enabledRef?: Ref<boolean>
}

export interface UsePaginatedToolsResult {
  tools: ComputedRef<ToolDTO[]>
  pageInfo: ComputedRef<PageInfoDTO | undefined>
  isFetching: Ref<boolean>
  error: Ref<BaseApiException | null> | Ref<undefined>
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (size: number) => void
}

export function usePaginatedTools ({
  currentPageRef,
  pageSizeRef,
  typeRef,
  previewModeRef,
  enabledRef,
}: UsePaginatedToolsParams): UsePaginatedToolsResult {
  const {
    currentPage,
    pageSizeSelected,
    onUpdateCurrentPage,
    onUpdatePageSize
  } = usePagination(currentPageRef, pageSizeRef ?? toRef(PageSizes.TWELVE))

  const isNational = computed(() => typeRef.value === EToolType.NATIONAL)

  const nationalParams = computed<GetNationalToolsParams>(() => ({
    page: currentPage.value,
    pageSize: pageSizeSelected.value,
  }))

  const localParams = computed<GetLocalToolsParams>(() => ({
    page: currentPage.value,
    pageSize: pageSizeSelected.value,
    type: typeRef.value,
  }))

  const availableParams = computed<GetAvailableToolsParams>(() => {
    return {
      page: currentPage.value,
      pageSize: pageSizeSelected.value,
      type: typeRef.value,
    }
  })

  const enabled = computed(() => enabledRef?.value === undefined || enabledRef?.value === true)

  const {
    data: nationalData,
    error: nationalError,
    isFetching: isNationalFetching
  } = useGetNationalTools(nationalParams, {
    query: {
      enabled: computed(() => isNational.value && enabled.value),
      placeholderData: keepPreviousData
    }
  })

  const {
    data: localData,
    error: localError,
    isFetching: isLocalFetching
  } = useGetLocalTools(localParams, {
    query: {
      enabled: computed(() => !isNational.value && enabled.value),
      placeholderData: keepPreviousData
    }
  })

  const {
    data: availableData,
    error: availableError,
    isFetching: isAvailableFetching
  } = useGetAvailableTools(availableParams, {
    query: {
      enabled: computed(() => previewModeRef?.value === true && enabled.value),
      placeholderData: keepPreviousData
    }
  })

  const tools = computed(() => {
    if (previewModeRef?.value) {
      return availableData.value?.data ?? []
    }
    return (isNational.value ? nationalData.value?.data : localData.value?.data) ?? []
  })

  const pageInfo = computed(() => {
    if (previewModeRef?.value) {
      return availableData.value?.page
    }
    return isNational.value ? nationalData.value?.page : localData.value?.page
  })

  const isFetching = computed(() => {
    if (previewModeRef?.value) {
      return isAvailableFetching.value
    }
    return isNational.value ? isNationalFetching.value : isLocalFetching.value
  })

  const error = computed(() => {
    if (previewModeRef?.value) {
      return availableError.value
    }
    return isNational.value ? nationalError.value : localError.value
  })

  return {
    tools,
    pageInfo,
    isFetching,
    error,
    onUpdateCurrentPage,
    onUpdatePageSize
  }
}
