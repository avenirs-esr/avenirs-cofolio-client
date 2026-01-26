import type { BaseApiException } from '@/common/exceptions'
import type { MutationArgs } from '@/types'
import {
  addSelfKnowledgeCategories,
  createSelfKnowledgeElement,
  deleteSelfKnowledgeElements,
  getSelfKnowledgeCategories,
  getSelfKnowledgeCategoriesAvailable,
  getSelfKnowledgeElementDetails,
  getSelfKnowledgeElements,
  type PagedResponseSelfKnowledgeElementViewDTO,
  type PageInfoDTO,
  removeSelfKnowledgeCategory,
  type SelfKnowledgeCategoryDTO,
  type SelfKnowledgeElementDetailsDTO,
  type SelfKnowledgeElementRequest,
  type SelfKnowledgeElementViewDTO,
  updateSelfKnowledgeElement
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { commonQueryKeys } from '@/features/student/global'
import { keepPreviousData, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue } from 'vue'

const selfKnowledgeCommonQueryKey = [...commonQueryKeys, 'self-knowledge']
const selfKnowledgeCategoriesQueryKey = [...selfKnowledgeCommonQueryKey, 'categories']
const selfKnowledgeElementsQueryKey = [...selfKnowledgeCommonQueryKey, 'elements']
const selfKnowledgeElementsViewQueryKey = [...selfKnowledgeElementsQueryKey, 'view']
const selfKnowledgeElementDetailsQueryKey = [...selfKnowledgeCommonQueryKey, 'element-details']
const selfKnowledgeCategoriesAvailableQueryKey = [...selfKnowledgeCommonQueryKey, 'available']

export const CATEGORY_ELEMENTS_PAGE_SIZE = 3

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
  const queryKey = computed(() => [...selfKnowledgeElementDetailsQueryKey, toValue(selfKnowledgeElementId)])

  const queryFn = computed(() => async (): Promise<SelfKnowledgeElementDetailsDTO> => {
    return await getSelfKnowledgeElementDetails(toValue(selfKnowledgeElementId))
  })

  const query = useQuery<SelfKnowledgeElementDetailsDTO, BaseApiException >({
    queryKey,
    queryFn,
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
  const queryKey = computed(() => [...selfKnowledgeElementsViewQueryKey, toValue(selfKnowledgeCategoryId), {
    page: toValue(page),
    pageSize: toValue(pageSize) ?? CATEGORY_ELEMENTS_PAGE_SIZE
  }])

  const queryFn = computed(() => async (): Promise<PagedResponseSelfKnowledgeElementViewDTO> => {
    return await getSelfKnowledgeElements(toValue(selfKnowledgeCategoryId), {
      page: toValue(page),
      pageSize: toValue(pageSize) ?? CATEGORY_ELEMENTS_PAGE_SIZE
    })
  })

  const query = useQuery<PagedResponseSelfKnowledgeElementViewDTO, BaseApiException>({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData,
    enabled: computed(() => {
      const id = toValue(selfKnowledgeCategoryId)

      if (id === undefined) {
        return false
      }

      return id.trim().length > 0
    })
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
  const invalidateSelfKnowledgeCommonQuery = useInvalidateQuery(selfKnowledgeCategoriesQueryKey)
  return useMutation<string, BaseApiException, AddSelfKnowledgeCategoriesVariables>({
    mutationFn: async ({ selectedIds }: AddSelfKnowledgeCategoriesVariables): Promise<string> => {
      return await addSelfKnowledgeCategories(selectedIds)
    },
    onSuccess: async (data, variables) => {
      await invalidateSelfKnowledgeCommonQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface RemoveSelfKnowledgeCategoryVariables {
  categoryId: string
}

export function useRemoveSelfKnowledgeCategoryMutation ({ onError, onSuccess }: MutationArgs<string, RemoveSelfKnowledgeCategoryVariables> = {}) {
  const invalidateSelfKnowledgeCommonQuery = useInvalidateQuery([...selfKnowledgeCommonQueryKey])
  return useMutation<string, BaseApiException, RemoveSelfKnowledgeCategoryVariables>({
    mutationFn: async ({ categoryId }: RemoveSelfKnowledgeCategoryVariables): Promise<string> => {
      return await removeSelfKnowledgeCategory(categoryId)
    },
    onSuccess: async (data, variables) => {
      await invalidateSelfKnowledgeCommonQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface DeleteSelfKnowledgeElementsVariables {
  selfKnowledgeElementIds: string[]
}

export function useDeleteSelfKnowledgeElementsMutation ({ onError, onSuccess }: MutationArgs<string, DeleteSelfKnowledgeElementsVariables> = {}) {
  const invalidateSelfKnowledgeElementsQuery = useInvalidateQuery([...selfKnowledgeElementsQueryKey])
  return useMutation<string, BaseApiException, DeleteSelfKnowledgeElementsVariables>({
    mutationFn: async ({ selfKnowledgeElementIds }: DeleteSelfKnowledgeElementsVariables): Promise<string> => {
      return await deleteSelfKnowledgeElements(selfKnowledgeElementIds)
    },
    onSuccess: async (data, variables) => {
      await invalidateSelfKnowledgeElementsQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface AddSelfKnowledgeCategoryElementVariables {
  selfKnowledgeCategoryId: string
  element: SelfKnowledgeElementRequest
}

export function useAddSelfKnowledgeCategoryElementMutation ({ onError, onSuccess }: MutationArgs<SelfKnowledgeElementViewDTO, AddSelfKnowledgeCategoryElementVariables> = {}) {
  const invalidateQuery = useInvalidateQuery()
  return useMutation<SelfKnowledgeElementViewDTO, BaseApiException, AddSelfKnowledgeCategoryElementVariables>({
    mutationFn: async ({ selfKnowledgeCategoryId, element }: AddSelfKnowledgeCategoryElementVariables): Promise<SelfKnowledgeElementViewDTO> => {
      return await createSelfKnowledgeElement(selfKnowledgeCategoryId, element)
    },
    onSuccess: async (data, variables) => {
      await invalidateQuery([...selfKnowledgeElementsViewQueryKey, variables.selfKnowledgeCategoryId])
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface UpdateSelfKnowledgeElementVariables {
  selfKnowledgeElementId: string
  element: SelfKnowledgeElementRequest
}

export function useUpdateSelfKnowledgeElementMutation (
  { onError, onSuccess }: MutationArgs<SelfKnowledgeElementViewDTO, UpdateSelfKnowledgeElementVariables> = {}
) {
  const invalidateQuery = useInvalidateQuery()

  return useMutation<SelfKnowledgeElementViewDTO, BaseApiException, UpdateSelfKnowledgeElementVariables>({
    mutationFn: async ({ selfKnowledgeElementId, element }: UpdateSelfKnowledgeElementVariables) => {
      return await updateSelfKnowledgeElement(selfKnowledgeElementId, element)
    },
    onSuccess: async (data, variables) => {
      await invalidateQuery([...selfKnowledgeElementDetailsQueryKey, variables.selfKnowledgeElementId])
      onSuccess?.(data, variables)
    },
    onError
  })
}
