import type { DeclaredProgramViewDTO, PageInfoDTO } from '@/api/avenir-esr'
import { useDeclaredProgramsViewQuery } from '@/features/student/personalCareer/queries/use-declared-programs.query'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
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
  const declaredPrograms = ref<DeclaredProgramViewDTO[]>([])
  const size = computed(() => toValue(pageSize) ?? toValue(declaredProgramsPageSizeSelected))

  const {
    pageInfo,
    declaredPrograms: fetchedDeclaredPrograms,
    isFetching
  } = useDeclaredProgramsViewQuery({
    page,
    pageSize: size
  })

  watch(fetchedDeclaredPrograms, (newDeclaredPrograms) => {
    if (pageInfo.value.page === 0) {
      declaredPrograms.value = newDeclaredPrograms
    }
    else {
      const existingIds = new Set(declaredPrograms.value.map(program => program.id))
      const merged: DeclaredProgramViewDTO[] = [...declaredPrograms.value]

      newDeclaredPrograms.forEach((program) => {
        if (!existingIds.has(program.id)) {
          merged.push(program)
        }
      })

      declaredPrograms.value = merged
    }
  }, { immediate: true })

  function loadMoreDeclaredPrograms () {
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
    declaredPrograms,
    pageInfo,
    page,
    isFetching,
    loadMoreDeclaredPrograms,
    resetPagination
  }
}
