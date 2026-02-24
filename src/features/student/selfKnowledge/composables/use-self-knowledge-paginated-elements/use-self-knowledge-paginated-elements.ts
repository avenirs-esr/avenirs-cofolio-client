import type { PageInfoDTO, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { useInfiniteScrollPagination } from '@/common/composables'
import {
  CATEGORY_ELEMENTS_PAGE_SIZE,
  useSelfKnowledgeCategoryElementsViewQuery
} from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import { type ComputedRef, type MaybeRef, type Ref, toValue } from 'vue'

export interface UseSelfKnowledgePaginatedElementsParams {
  selfKnowledgeCategoryId: MaybeRef<string>
  pageSize?: MaybeRef<number>
}

export interface UseSelfKnowledgePaginatedElementsResult {
  elements: Ref<SelfKnowledgeElementViewDTO[]>
  pageInfo: Ref<PageInfoDTO>
  page: Ref<number>
  isFetching: Ref<boolean>
  loadMoreElements: () => void
  resetPagination: () => void
  hasMoreElements: ComputedRef<boolean>
}

export function useSelfKnowledgePaginatedElements ({
  selfKnowledgeCategoryId,
  pageSize
}: UseSelfKnowledgePaginatedElementsParams): UseSelfKnowledgePaginatedElementsResult {
  const categoryId = computed(() => toValue(selfKnowledgeCategoryId))
  const size = computed(() => toValue(pageSize) ?? CATEGORY_ELEMENTS_PAGE_SIZE)
  const page = ref(0)

  const {
    pageInfo,
    elements: fetchedElements,
    isFetching
  } = useSelfKnowledgeCategoryElementsViewQuery({
    selfKnowledgeCategoryId: categoryId,
    page,
    pageSize: size
  })

  const {
    items: elements,
    hasMoreItems: hasMoreElements,
    loadMore: loadMoreElements,
    resetPagination
  } = useInfiniteScrollPagination({
    fetchedItems: fetchedElements,
    pageInfo,
    isFetching,
    page,
  })

  watch(categoryId, () => {
    resetPagination()
  })

  return {
    elements,
    pageInfo,
    page,
    isFetching,
    hasMoreElements,
    loadMoreElements,
    resetPagination
  }
}
