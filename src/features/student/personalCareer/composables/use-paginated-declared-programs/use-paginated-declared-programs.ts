import { type DeclaredProgramViewDTO, type PageInfoDTO, useGetDeclaredPrograms } from '@/api/avenir-esr'
import { useInfiniteScrollPagination } from '@/common/composables'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { keepPreviousData } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue } from 'vue'

export interface UsePaginatedDeclaredProgramsParams {
  pageSize?: MaybeRef<number>
}

export interface UsePaginatedDeclaredProgramsResult {
  declaredPrograms: Ref<DeclaredProgramViewDTO[]>
  pageInfo: Ref<PageInfoDTO>
  page: Ref<number>
  isFetching: Ref<boolean>
  loadMoreDeclaredPrograms: () => void
  resetPagination: () => void
}

export function usePaginatedDeclaredPrograms ({
  pageSize
}: UsePaginatedDeclaredProgramsParams = {}): UsePaginatedDeclaredProgramsResult {
  const { declaredProgramsPageSizeSelected } = usePersonalCareerStore()
  const page = ref(0)

  const declaredProgramsParams = computed(() => ({
    page: page.value,
    pageSize: toValue(pageSize) ?? toValue(declaredProgramsPageSizeSelected)
  }))

  const { data, isFetching } = useGetDeclaredPrograms(declaredProgramsParams, { query: { placeholderData: keepPreviousData } })
  const fetchedDeclaredPrograms = computed(() => data.value?.data ?? [])
  const pageInfo = computed(() => data.value?.page ?? { page: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  const {
    items: declaredPrograms,
    loadMore: loadMoreDeclaredPrograms,
    resetPagination
  } = useInfiniteScrollPagination({
    fetchedItems: fetchedDeclaredPrograms,
    pageInfo,
    isFetching,
    page,
  })

  return {
    declaredPrograms,
    pageInfo,
    page,
    isFetching,
    loadMoreDeclaredPrograms,
    resetPagination
  }
}
