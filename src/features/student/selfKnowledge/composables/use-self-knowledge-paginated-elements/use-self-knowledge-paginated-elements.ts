import type { PageInfoDTO, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { useSelfKnowledgeCategoryElementsViewQuery } from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import { type MaybeRef, type Ref, toValue } from 'vue'

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
}

const DEFAULT_PAGE_SIZE = 3

export function useSelfKnowledgePaginatedElements ({
  selfKnowledgeCategoryId,
  pageSize
}: UseSelfKnowledgePaginatedElementsParams): UseSelfKnowledgePaginatedElementsResult {
  const categoryId = computed(() => toValue(selfKnowledgeCategoryId))
  const page = ref(0)
  const elements = ref<SelfKnowledgeElementViewDTO[]>([])
  const size = computed(() => toValue(pageSize) ?? DEFAULT_PAGE_SIZE)

  watch(categoryId, () => {
    page.value = 0
    elements.value = []
  })

  const {
    pageInfo,
    elements: fetchedElements,
    isFetching
  } = useSelfKnowledgeCategoryElementsViewQuery({
    selfKnowledgeCategoryId: categoryId,
    page,
    pageSize: size
  })

  watch(fetchedElements, (newElements) => {
    if (!categoryId.value) {
      elements.value = []
      return
    }

    if (pageInfo.value.page === 0) {
      elements.value = newElements
    }
    else {
      const existingIds = new Set(elements.value.map(el => el.id))
      const merged: SelfKnowledgeElementViewDTO[] = [...elements.value]

      newElements.forEach((el) => {
        if (!existingIds.has(el.id)) {
          merged.push(el)
        }
      })

      elements.value = merged
    }
  }, { immediate: true })

  function loadMoreElements () {
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
    elements,
    pageInfo,
    page,
    isFetching,
    loadMoreElements,
    resetPagination
  }
}
