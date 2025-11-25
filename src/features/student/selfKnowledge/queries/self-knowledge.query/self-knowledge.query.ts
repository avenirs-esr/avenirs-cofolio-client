import type { BaseApiException } from '@/common/exceptions'
import type { MutationArgs } from '@/types'
import {
  addSelfKnowledgeCategories,
  getSelfKnowledgeCategories,
  getSelfKnowledgeCategoriesAvailable,
  getSelfKnowledgeElementDetails,
  getSelfKnowledgeElements,
  type PagedResponseSelfKnowledgeElementViewDTO,
  type PageInfoDTO,
  removeSelfKnowledgeCategory,
  type SelfKnowledgeCategoryDTO,
  type SelfKnowledgeElementDetailsDTO,
  type SelfKnowledgeElementViewDTO
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { commonQueryKeys } from '@/features/student/global'
import { keepPreviousData, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue } from 'vue'

const selfKnowledgeCommonQueryKey = [...commonQueryKeys, 'self-knowledge']
const selfKnowledgeCategoriesQueryKey = [...selfKnowledgeCommonQueryKey, 'categories']
const selfKnowledgeElementsQueryKey = [...selfKnowledgeCommonQueryKey, 'elements']
const selfKnowledgeElementDetailsQueryKey = [...selfKnowledgeCommonQueryKey, 'element-details']
const selfKnowledgeCategoriesAvailableQueryKey = [...selfKnowledgeCommonQueryKey, 'available']

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

export interface SelfKnowledgeElementDetailsQueryParams {
  selfKnowledgeElementId: MaybeRef<string>
}

export function useSelfKnowledgeElementDetailsQuery ({
  selfKnowledgeElementId
}: SelfKnowledgeElementDetailsQueryParams): UseQueryReturnType<SelfKnowledgeElementDetailsDTO | undefined, BaseApiException> & {
  element: Ref<SelfKnowledgeElementDetailsDTO | undefined>
} {
  const queryKey = computed(() => [...selfKnowledgeElementDetailsQueryKey])

  const queryFn = computed(() => async (): Promise<SelfKnowledgeElementDetailsDTO> => {
    return await getSelfKnowledgeElementDetails(toValue(selfKnowledgeElementId))
  })

  const query = useQuery<SelfKnowledgeElementDetailsDTO, BaseApiException >({
    queryKey,
    queryFn,
    staleTime: TWO_MINUTES
  })

  const element = computed(() => query.data.value)

  return {
    ...query,
    element
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
  const queryKey = computed(() => [...selfKnowledgeCategoriesAvailableQueryKey])

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

export interface AddSelfKnowledgeCategoriesVariables {
  selectedIds: string[]
}

export function useAddSelfKnowledgeCategoriesMutation ({ onError, onSuccess }: MutationArgs<string, AddSelfKnowledgeCategoriesVariables> = {}) {
  const invalidateSelfKnowledgeCategoriesQuery = useInvalidateQuery([...selfKnowledgeCategoriesAvailableQueryKey])
  return useMutation<string, BaseApiException, AddSelfKnowledgeCategoriesVariables>({
    mutationFn: async ({ selectedIds }: AddSelfKnowledgeCategoriesVariables): Promise<string> => {
      return await addSelfKnowledgeCategories(selectedIds)
    },
    onSuccess: async (data, variables) => {
      await invalidateSelfKnowledgeCategoriesQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface RemoveSelfKnowledgeCategoryVariables {
  categoryId: string
}

export function useRemoveSelfKnowledgeCategoryMutation ({ onError, onSuccess }: MutationArgs<string, RemoveSelfKnowledgeCategoryVariables> = {}) {
  const invalidateSelfKnowledgeCategoriesQuery = useInvalidateQuery([...selfKnowledgeCategoriesAvailableQueryKey, ...selfKnowledgeCategoriesQueryKey])
  return useMutation<string, BaseApiException, RemoveSelfKnowledgeCategoryVariables>({
    mutationFn: async ({ categoryId }: RemoveSelfKnowledgeCategoryVariables): Promise<string> => {
      return await removeSelfKnowledgeCategory(categoryId)
    },
    onSuccess: async (data, variables) => {
      await invalidateSelfKnowledgeCategoriesQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}
