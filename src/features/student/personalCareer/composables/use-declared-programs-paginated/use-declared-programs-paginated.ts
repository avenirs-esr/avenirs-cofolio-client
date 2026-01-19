import type { DeclaredProgramViewDTO, PageInfoDTO } from '@/api/avenir-esr'
import { useDeclaredProgramsViewQuery } from '@/features/student/personalCareer/queries/use-declared-programs.query'
import { type MaybeRef, type Ref, toValue } from 'vue'

export interface UseDeclaredProgramsPaginatedParams {
  pageSize?: MaybeRef<number>
}

export interface UseDeclaredProgramsPaginatedResult {
  programs: Ref<DeclaredProgramViewDTO[]>
  pageInfo: Ref<PageInfoDTO>
  page: Ref<number>
  isFetching: Ref<boolean>
  loadMorePrograms: () => void
  resetPagination: () => void
}

export function useDeclaredProgramsPaginated ({
  pageSize
}: UseDeclaredProgramsPaginatedParams = {}): UseDeclaredProgramsPaginatedResult {
  const page = ref(0)
  const size = computed(() => toValue(pageSize) ?? 10)
  const programs = ref<DeclaredProgramViewDTO[]>([])

  const {
    pageInfo,
    declaredPrograms: fetchedPrograms,
    isFetching
  } = useDeclaredProgramsViewQuery({
    page,
    pageSize: size
  })

  watch(fetchedPrograms, (newPrograms) => {
    if (page.value === 0) {
      programs.value = newPrograms
    }
    else {
      const existingIds = new Set(programs.value.map(p => p.id))
      const merged: DeclaredProgramViewDTO[] = [...programs.value]

      newPrograms.forEach((p) => {
        if (!existingIds.has(p.id)) {
          merged.push(p)
        }
      })

      programs.value = merged
    }
  })

  function loadMorePrograms () {
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
    programs,
    pageInfo,
    page,
    isFetching,
    loadMorePrograms,
    resetPagination
  }
}
