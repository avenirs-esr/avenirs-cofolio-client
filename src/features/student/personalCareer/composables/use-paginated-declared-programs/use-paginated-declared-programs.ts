import type { DeclaredProgramViewDTO, PageInfoDTO } from '@/api/avenir-esr'
import { useInfiniteScrollPagination } from '@/common/composables'
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

  const {
    pageInfo,
    declaredPrograms: fetchedDeclaredPrograms,
    isFetching
  } = useDeclaredProgramsViewQuery({
    page,
    pageSize: computed(() => toValue(pageSize) ?? toValue(declaredProgramsPageSizeSelected))
  })

  const {
    items: declaredPrograms,
    loadMore: loadMoreDeclaredPrograms,
    resetPagination
  } = useInfiniteScrollPagination({
    fetchedItems: fetchedDeclaredPrograms,
    pageInfo,
    isFetching,
    page,
    getItemId: (program: DeclaredProgramViewDTO) => program.id
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
