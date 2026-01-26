import type { DeclaredExperienceViewDTO, PageInfoDTO } from '@/api/avenir-esr'
import { useInfiniteScrollPagination } from '@/common/composables'
import { useDeclaredExperiencesViewQuery } from '@/features/student/personalCareer/queries/use-declared-experiences.query'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
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

  const { pageInfo, declaredExperiences: fetchedDeclaredExperiences, isFetching } = useDeclaredExperiencesViewQuery({
    page,
    pageSize: computed(() => toValue(pageSize) ?? declaredExperiencesPageSizeSelected)
  })

  const {
    items: declaredExperiences,
    loadMore: loadMoreDeclaredExperiences,
    resetPagination
  } = useInfiniteScrollPagination({
    fetchedItems: fetchedDeclaredExperiences,
    pageInfo,
    isFetching,
    page,
    getItemId: (experience: DeclaredExperienceViewDTO) => experience.id
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
