import type { BaseApiException } from '@/common/exceptions'
import type { PageSizes } from '@avenirs-esr/avenirs-dsav'
import type { ComputedRef, MaybeRef, Ref } from 'vue'
import { EFeedbackStatus, type FeedbackStaffListItemDTO, type PagedResponseFeedbackStaffListItemDTO, type PageInfoDTO } from '@/api/avenir-esr'
import { usePagination } from '@/common/composables'
import { keepPreviousData, type UseQueryOptions, type UseQueryReturnType } from '@tanstack/vue-query'

type FetchFn = (
  params: MaybeRef<{ page: number, pageSize: PageSizes, status?: EFeedbackStatus }>,
  options?: { query?: Partial<UseQueryOptions<PagedResponseFeedbackStaffListItemDTO, BaseApiException>> }
) => UseQueryReturnType<PagedResponseFeedbackStaffListItemDTO, BaseApiException>

export interface UsePaginatedStaffFeedbacksParams {
  currentPageRef: Ref<number>
  pageSizeRef: Ref<PageSizes>
  selectedStatusRef?: Ref<'ALL' | EFeedbackStatus>
  fetchFn: FetchFn
}

export interface UsePaginatedStaffFeedbacksResult {
  feedbacks: ComputedRef<FeedbackStaffListItemDTO[]>
  pageInfo: ComputedRef<PageInfoDTO | undefined>
  isFetching: Ref<boolean>
  error: Ref<BaseApiException | null> | Ref<undefined>
  pageSizeSelected: Ref<PageSizes>
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (size: number) => void
}

export function usePaginatedStaffFeedbacks ({ currentPageRef, pageSizeRef, selectedStatusRef, fetchFn }: UsePaginatedStaffFeedbacksParams): UsePaginatedStaffFeedbacksResult {
  const { currentPage, pageSizeSelected, onUpdateCurrentPage, onUpdatePageSize } = usePagination(currentPageRef, pageSizeRef)

  const statuses = computed(() => {
    if (!selectedStatusRef || selectedStatusRef.value === 'ALL') {
      return
    }

    if (selectedStatusRef.value === EFeedbackStatus.SUBMITTED) {
      return [EFeedbackStatus.SUBMITTED, EFeedbackStatus.SEEN]
    }

    return [selectedStatusRef.value]
  })
  const params = computed(() => ({ page: currentPage.value, pageSize: pageSizeSelected.value, statuses: statuses.value }))
  const { data, error, isFetching } = fetchFn(params, { query: { placeholderData: keepPreviousData } })

  const feedbacks = computed(() => data.value?.data ?? [])
  const pageInfo = computed(() => data.value?.page)

  return {
    feedbacks,
    pageInfo,
    isFetching,
    error,
    pageSizeSelected,
    onUpdateCurrentPage,
    onUpdatePageSize
  }
}
