import type { PageSizes } from '@avenirs-esr/avenirs-dsav'
import type { ComputedRef, Ref } from 'vue'
import type { ContextualAuthorizationDTO, EAuthorizationEntityType, PageInfoDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { keepPreviousData } from '@tanstack/vue-query'
import { useGetExternalUserAuthorizations } from '@/api/avenir-esr'
import { usePagination } from '@/common/composables'

export interface UsePaginatedUserContextualAuthorizationsParams {
  userIdRef: Ref<string>
  currentPageRef: Ref<number>
  pageSizeRef: Ref<PageSizes>
  entityTypeRef: Ref<EAuthorizationEntityType | undefined>
  enabledRef: ComputedRef<boolean>
}

export interface UsePaginatedUserContextualAuthorizationsResult {
  authorizations: ComputedRef<ContextualAuthorizationDTO[]>
  pageInfo: ComputedRef<PageInfoDTO | undefined>
  isFetching: Ref<boolean>
  error: Ref<BaseApiException | null> | Ref<undefined>
  pageSizeSelected: Ref<PageSizes>
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (size: number) => void
}

export function usePaginatedUserContextualAuthorizations ({
  currentPageRef,
  pageSizeRef,
  entityTypeRef,
  userIdRef,
  enabledRef,
}: UsePaginatedUserContextualAuthorizationsParams): UsePaginatedUserContextualAuthorizationsResult {
  const { currentPage, pageSizeSelected, onUpdateCurrentPage, onUpdatePageSize } = usePagination(currentPageRef, pageSizeRef)

  const params = computed(() => ({
    page: currentPage.value,
    pageSize: pageSizeSelected.value,
    entityType: entityTypeRef.value!,
  }))

  const { data, error, isFetching } = useGetExternalUserAuthorizations(userIdRef, params, {
    query: { placeholderData: keepPreviousData, enabled: enabledRef }
  })

  const authorizations = computed(() => data.value?.data ?? [])
  const pageInfo = computed(() => data.value?.page)

  return {
    authorizations,
    pageInfo,
    isFetching,
    error,
    pageSizeSelected,
    onUpdateCurrentPage,
    onUpdatePageSize
  }
}
