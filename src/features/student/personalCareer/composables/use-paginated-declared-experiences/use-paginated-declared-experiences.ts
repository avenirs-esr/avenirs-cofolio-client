import type { DeclaredExperienceViewDTO, PageInfoDTO } from '@/api/avenir-esr'
import type { Ref } from 'vue'
import { useDeclaredExperiencesViewQuery } from '@/features/student/personalCareer/queries/use-declared-experiences.query'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'

export interface UsePaginatedDeclaredExperiencesResult {
  declaredExperiences: Ref<DeclaredExperienceViewDTO[]>
  pageInfo: Ref<PageInfoDTO>
  page: Ref<number>
  isFetching: Ref<boolean>
  loadMoreDeclaredExperiences: () => void
  resetPagination: () => void
}

export function usePaginatedDeclaredExperiences (): UsePaginatedDeclaredExperiencesResult {
  const { declaredExperiencesPageSizeSelected } = usePersonalCareerStore()
  const page = ref(0)
  const declaredExperiences = ref<DeclaredExperienceViewDTO[]>([])
  const { pageInfo, declaredExperiences: fetchedDeclaredExperiences, isFetching } = useDeclaredExperiencesViewQuery({ page, pageSize: declaredExperiencesPageSizeSelected })

  watch(fetchedDeclaredExperiences, (newDeclaredExperiences) => {
    if (pageInfo.value.page === 0) {
      declaredExperiences.value = newDeclaredExperiences
    }
    else {
      const existingIds = new Set(declaredExperiences.value.map(experience => experience.id))
      const merged: DeclaredExperienceViewDTO[] = [...declaredExperiences.value]

      newDeclaredExperiences.forEach((experience) => {
        if (!existingIds.has(experience.id)) {
          merged.push(experience)
        }
      })

      declaredExperiences.value = merged
    }
  })

  function loadMoreDeclaredExperiences () {
    if (isFetching.value) {
      return
    }
    if (page.value < pageInfo.value.totalPages - 1) {
      page.value += 1
    }
  }

  function resetPagination () {
    page.value = 0
  }

  return {
    declaredExperiences,
    pageInfo,
    page,
    isFetching,
    loadMoreDeclaredExperiences,
    resetPagination
  }
}
