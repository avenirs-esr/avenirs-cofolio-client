import type { PageInfoDTO, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import {
  useGetCachedSelfKnowledgeElements,
  useSelfKnowledgeCategoryElementsViewQuery
} from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
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

export function useSelfKnowledgePaginatedElements ({
  selfKnowledgeCategoryId,
  pageSize
}: UseSelfKnowledgePaginatedElementsParams): UseSelfKnowledgePaginatedElementsResult {
  const { getCachedElements } = useGetCachedSelfKnowledgeElements()

  const categoryId = computed(() => toValue(selfKnowledgeCategoryId))
  const page = ref(0)
  const size = computed(() => toValue(pageSize) ?? 3)
  const elements = ref<SelfKnowledgeElementViewDTO[]>([])

  watch(
    categoryId,
    (newCategoryId) => {
      if (!newCategoryId) {
        elements.value = []
        page.value = 0
        return
      }

      const cached = getCachedElements(newCategoryId)
      elements.value = cached.elements

      if (cached.currentPage >= 0) {
        page.value = cached.currentPage
      }
      else {
        page.value = 0
      }
    },
    { immediate: true }
  )

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

    if (page.value === 0) {
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
  })

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
