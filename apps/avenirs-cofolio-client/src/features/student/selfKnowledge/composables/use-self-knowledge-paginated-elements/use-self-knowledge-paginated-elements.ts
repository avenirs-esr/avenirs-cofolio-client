import type { ComputedRef, MaybeRef, Ref } from 'vue'
import type { ESelfKnowledgeCategory, GetSelfKnowledgeElementsParams, PageInfoDTO, SelfKnowledgeElementViewDTO } from '@/api/avenir-esr'
import { keepPreviousData } from '@tanstack/vue-query'
import { toValue } from 'vue'
import { useGetSelfKnowledgeElements } from '@/api/avenir-esr'
import { useInfiniteScrollPagination } from '@/common/composables'
import { CATEGORY_ELEMENTS_PAGE_SIZE, toSelfKnowledgeCategoriesParam } from '@/features/student/selfKnowledge/utils/category.utils'

export interface UseSelfKnowledgePaginatedElementsParams {
  selfKnowledgeCategory: MaybeRef<ESelfKnowledgeCategory>
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
  selfKnowledgeCategory,
  pageSize
}: UseSelfKnowledgePaginatedElementsParams): UseSelfKnowledgePaginatedElementsResult {
  const categoryType = computed(() => toValue(selfKnowledgeCategory))
  const size = computed(() => toValue(pageSize) ?? CATEGORY_ELEMENTS_PAGE_SIZE)
  const page = ref(0)

  const params = computed<GetSelfKnowledgeElementsParams>(() => ({
    selfKnowledgeCategories: toSelfKnowledgeCategoriesParam(categoryType.value),
    page: page.value,
    pageSize: size.value
  }))

  const { data, isFetching } = useGetSelfKnowledgeElements(params, {
    query: { enabled: computed(() => !!categoryType.value), placeholderData: keepPreviousData }
  })

  const fetchedElements = computed(() => data.value?.data ?? [])
  const pageInfo = computed(() => data.value?.page ?? { page: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

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

  watch(categoryType, () => {
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
