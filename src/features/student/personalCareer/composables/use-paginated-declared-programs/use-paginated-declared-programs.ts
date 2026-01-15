import type { DeclaredProgramViewDTO, PageInfoDTO } from '@/api/avenir-esr'
import { useDeclaredProgramsViewQuery, useGetCachedDeclaredPrograms } from '@/features/student/personalCareer/queries/use-declared-programs.query'
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
}: UsePaginatedDeclaredProgramsParams): UsePaginatedDeclaredProgramsResult {
  const { getCachedDeclaredPrograms } = useGetCachedDeclaredPrograms()
  const page = ref(0)
  const size = computed(() => toValue(pageSize) ?? 3)
  const declaredPrograms = ref<DeclaredProgramViewDTO[]>([])

  const cached = getCachedDeclaredPrograms()
  declaredPrograms.value = cached.declaredPrograms
  if (cached.currentPage >= 0) {
    page.value = cached.currentPage
  }

  const {
    pageInfo,
    declaredPrograms: fetchedDeclaredPrograms,
    isFetching
  } = useDeclaredProgramsViewQuery({
    page,
    pageSize: size
  })

  watch(fetchedDeclaredPrograms, (newDeclaredPrograms) => {
    if (page.value === 0) {
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
  })

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
