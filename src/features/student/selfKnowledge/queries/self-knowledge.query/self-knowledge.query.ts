import type { BaseApiException } from '@/common/exceptions'
import {
  getSelfKnowledgeCategories,
  getSelfKnowledgeCategories1,
  getSelfKnowledgeCategoriesAvailable,
  getSelfKnowledgeElements,
  type PagedResponseSelfKnowledgeElementViewDTO,
  type PageInfoDTO,
  type SelfKnowledgeCategoryDTO,
  type SelfKnowledgeElementViewDTO
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { commonQueryKeys } from '@/features/student/global'
import { keepPreviousData, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue } from 'vue'

const selfKnowledgeCommonQueryKey = [...commonQueryKeys, 'self-knowledge']
const selfKnowledgeCategoriesQueryKey = [...selfKnowledgeCommonQueryKey, 'categories']
const selfKnowledgeElementsQueryKey = [...selfKnowledgeCommonQueryKey, 'elements']

const TWO_MINUTES = 2 * 60 * 1000
const CATEGORY_ELEMENTS_PAGE_SIZE = 3

export function useSelfKnowledgeCategoriesQuery (): UseQueryReturnType<SelfKnowledgeCategoryDTO[], BaseApiException> & {
  categories: Ref<SelfKnowledgeCategoryDTO[]>
} {
  const queryKey = computed(() => [...selfKnowledgeCategoriesQueryKey])

  const queryFn = computed(() => async (): Promise<SelfKnowledgeCategoryDTO[]> => {
    return await getSelfKnowledgeCategories()
  })

  const query = useQuery<SelfKnowledgeCategoryDTO[], BaseApiException >({
    queryKey,
    queryFn,
    staleTime: TWO_MINUTES
  })

  const categories = computed(() => query.data.value ?? [])

  return {
    ...query,
    categories
  }
}

export interface SelfKnowledgeCategoryElementsViewQueryParams {
  selfKnowledgeCategoryId: MaybeRef<string>
  page: MaybeRef<number>
  pageSize?: MaybeRef<number>
}

type SelfKnowledgeCategoryElementsViewQueryReturnType = UseQueryReturnType<PagedResponseSelfKnowledgeElementViewDTO, BaseApiException> & {
  elements: Ref<SelfKnowledgeElementViewDTO[]>
  pageInfo: Ref<PageInfoDTO>
}

export function useSelfKnowledgeCategoryElementsViewQuery ({
  selfKnowledgeCategoryId,
  page,
  pageSize
}: SelfKnowledgeCategoryElementsViewQueryParams
): SelfKnowledgeCategoryElementsViewQueryReturnType {
  const queryKey = computed(() => [...selfKnowledgeElementsQueryKey, 'view', {
    selfKnowledgeCategoryId: toValue(selfKnowledgeCategoryId),
    page: toValue(page),
    pageSize: toValue(pageSize) ?? CATEGORY_ELEMENTS_PAGE_SIZE
  }])

  const queryFn = computed(() => async (): Promise<PagedResponseSelfKnowledgeElementViewDTO> => {
    return await getSelfKnowledgeElements(toValue(selfKnowledgeCategoryId), {
      page: toValue(page),
      pageSize: toValue(pageSize) ?? CATEGORY_ELEMENTS_PAGE_SIZE
    })
  })

  const query = useQuery<PagedResponseSelfKnowledgeElementViewDTO, BaseApiException >({
    queryKey,
    queryFn,
    staleTime: TWO_MINUTES,
    placeholderData: keepPreviousData,
    enabled: computed(() => toValue(selfKnowledgeCategoryId).trim().length > 0)
  })

  const elements = computed(() => query.data.value?.data ?? [])
  const pageInfo = computed(() => query.data.value?.page ?? { page: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  return {
    ...query,
    elements,
    pageInfo
  }
}

export function useSelfKnowledgeCategoriesAvailableQuery (): UseQueryReturnType<SelfKnowledgeCategoryDTO[], BaseApiException> & {
  categoriesAvailable: Ref<SelfKnowledgeCategoryDTO[]>
} {
  const queryKey = computed(() => [...selfKnowledgeCommonQueryKey, 'available'])

  const queryFn = computed(() => async (): Promise<SelfKnowledgeCategoryDTO[]> => {
    return await getSelfKnowledgeCategoriesAvailable()
  })

  const query = useQuery<SelfKnowledgeCategoryDTO[], BaseApiException >({
    queryKey,
    queryFn,
    staleTime: TWO_MINUTES
  })

  const categoriesAvailable = computed(() => query.data.value ?? [])

  return {
    ...query,
    categoriesAvailable
  }
}

export interface UpdateSelfKnowledgeCategoriesVariables {
  selectedIds: string[]
}

export interface UseUpdateSelfKnowledgeCategoriesMutationArgs {
  onSuccess?: (data: string, variables: UpdateSelfKnowledgeCategoriesVariables) => void
  onError?: (error: BaseApiException) => void
}

export function useUpdateSelfKnowledgeCategoriesMutation ({ onError, onSuccess }: UseUpdateSelfKnowledgeCategoriesMutationArgs = {}) {
  const invalidateSelfKnowledgeCategoriesQuery = useInvalidateQuery([...selfKnowledgeCommonQueryKey, 'available'])
  return useMutation<string, BaseApiException, UpdateSelfKnowledgeCategoriesVariables>({
    mutationFn: async ({ selectedIds }: UpdateSelfKnowledgeCategoriesVariables): Promise<string> => {
      return await getSelfKnowledgeCategories1(selectedIds)
    },
    onSuccess: async (data, variables) => {
      await invalidateSelfKnowledgeCategoriesQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}
