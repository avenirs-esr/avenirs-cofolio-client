import { type DeclaredExperienceViewDTO, type PageInfoDTO, useGetDeclaredExperienceView } from '@/api/avenir-esr'
import { useInfiniteScrollPagination } from '@/common/composables'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import { keepPreviousData } from '@tanstack/vue-query'
import { type Ref, toValue } from 'vue'

export interface UsePaginatedDeclaredExperiencesResult {
  declaredExperiences: Ref<DeclaredExperienceViewDTO[]>
  pageInfo: Ref<PageInfoDTO>
  page: Ref<number>
  isFetching: Ref<boolean>
  loadMoreDeclaredExperiences: () => void
  resetPagination: () => void
}

export function usePaginatedDeclaredExperiences ({ pageSize }: { pageSize?: Ref<number> } = {}): UsePaginatedDeclaredExperiencesResult {
  const { declaredExperiencesPageSizeSelected } = usePersonalCareerStore()
  const page = ref(0)

  const params = computed(() => ({
    page: page.value,
    pageSize: toValue(pageSize) ?? declaredExperiencesPageSizeSelected
  }))

  const { data, isFetching } = useGetDeclaredExperienceView(params, { query: { placeholderData: keepPreviousData } })
  const fetchedDeclaredExperiences = computed(() => data.value?.data || [])
  const pageInfo = computed(() => data.value?.page ?? { page: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  const {
    items: declaredExperiences,
    loadMore: loadMoreDeclaredExperiences,
    resetPagination
  } = useInfiniteScrollPagination({
    fetchedItems: fetchedDeclaredExperiences,
    pageInfo,
    isFetching,
    page,
  })

  return {
    declaredExperiences,
    pageInfo,
    page,
    isFetching,
    loadMoreDeclaredExperiences,
    resetPagination
  }
}
