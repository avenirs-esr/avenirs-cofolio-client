import type { PageSizes } from '@avenirs-esr/avenirs-dsav'
import type { BaseApiException } from '@avenirs-esr/shared'
import type {
  DeclaredActivityToAssessDTO,
  EActivityAssessmentStatus,
  GetDeclaredActivitiesToAssessParams,
  PageInfoDTO
} from '@avenirs-esr/shared/api/avenir-esr'
import type { ComputedRef, Ref } from 'vue'
import { useGetDeclaredActivitiesToAssess } from '@avenirs-esr/shared/api/avenir-esr'
import { keepPreviousData } from '@tanstack/vue-query'
import { usePagination } from '@/common/composables'

export interface UsePaginatedStaffAssessmentsParams {
  statusesRef: Ref<EActivityAssessmentStatus[] | undefined>
  currentPageRef: Ref<number>
  pageSizeRef: Ref<PageSizes>
}

export interface UsePaginatedStaffAssessmentsResult {
  assessments: ComputedRef<DeclaredActivityToAssessDTO[]>
  pageInfo: ComputedRef<PageInfoDTO | undefined>
  isFetching: Ref<boolean>
  error: Ref<BaseApiException | null> | Ref<undefined>
  pageSizeSelected: Ref<PageSizes>
  onUpdateCurrentPage: (page: number) => void
  onUpdatePageSize: (size: number) => void
}

export function usePaginatedStaffAssessments ({
  statusesRef,
  currentPageRef,
  pageSizeRef,
}: UsePaginatedStaffAssessmentsParams): UsePaginatedStaffAssessmentsResult {
  const { currentPage, pageSizeSelected, onUpdateCurrentPage, onUpdatePageSize } = usePagination(currentPageRef, pageSizeRef)

  const params: ComputedRef<GetDeclaredActivitiesToAssessParams> = computed(() => ({
    statuses: statusesRef.value,
    page: currentPage.value,
    pageSize: pageSizeSelected.value,
  }))

  const { data, error, isFetching } = useGetDeclaredActivitiesToAssess(params, {
    query: { placeholderData: keepPreviousData }
  })

  const assessments = computed(() => data.value?.data ?? [])
  const pageInfo = computed(() => data.value?.page)

  return {
    assessments,
    pageInfo,
    isFetching,
    error,
    pageSizeSelected,
    onUpdateCurrentPage,
    onUpdatePageSize
  }
}
