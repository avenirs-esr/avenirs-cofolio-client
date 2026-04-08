import type { BaseApiException } from '@/common/exceptions'
import type { MutationArgs } from '@/types'
import {
  type AddDeclaredSkillDTO,
  createDeclaredSkillProgress,
  type DeclaredSkillDTO,
  type DeclaredSkillProgressDetailsDTO,
  type DeclaredSkillProgressDTO,
  type DeclaredSkillProgressRequest,
  deleteDeclaredSkillProgress,
  getDeclaredSkillProgressDetails,
  getDeclaredSkillsProgresses,
  type PagedResponseDeclaredSkillDTO,
  type PagedResponseDeclaredSkillProgressDTO,
  type PagedResponseExternalSkillDTO,
  type PageInfoDTO,
  searchExternalSkills,
  unassociateTraces,
  updateDeclaredSkillProgress
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue, type UnwrapRef } from 'vue'

const declaredSkillCommonQueryKey = ['user', 'student', 'declared-skills']
const declaredSkillDetailsQueryKey = [...declaredSkillCommonQueryKey, 'details']

export function useDeclaredSkillsViewQuery (
  page: Ref<number>,
  pageSize: Ref<number>
): UseQueryReturnType<PagedResponseDeclaredSkillDTO | PagedResponseDeclaredSkillProgressDTO, BaseApiException> & {
  skills: Ref<DeclaredSkillDTO[] | DeclaredSkillProgressDTO[]>
  pageInfo: Ref<PageInfoDTO>
} {
  const queryKey = computed(() => [...declaredSkillCommonQueryKey, 'view', {
    page: page.value,
    pageSize: pageSize.value
  }])

  const queryFn = computed(() => async (): Promise<PagedResponseDeclaredSkillDTO | PagedResponseDeclaredSkillProgressDTO> => {
    return await getDeclaredSkillsProgresses({
      pageSize: toValue(pageSize),
      page: toValue(page.value),
    })
  })

  const query = useQuery<
    PagedResponseDeclaredSkillDTO | PagedResponseDeclaredSkillProgressDTO,
    BaseApiException,
    PagedResponseDeclaredSkillDTO | PagedResponseDeclaredSkillProgressDTO,
    readonly unknown[]
  >({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData
  })

  const skills = computed(() => query.data.value?.data ?? [])
  const pageInfo = computed(() => query.data.value?.page ?? { page: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  return {
    ...query,
    skills,
    pageInfo,
  }
}

export function useSearchExternalSkillsQuery (
  keyword: Ref<string>,
  pageSize: Ref<number>
) {
  const queryKey = computed(() => [...declaredSkillCommonQueryKey, 'search-declared', {
    keyword: keyword.value,
    pageSize: pageSize.value
  }])

  const queryFn = computed(() => async ({ pageParam = 0 }): Promise<PagedResponseExternalSkillDTO> => {
    return await searchExternalSkills({
      keyword: toValue(keyword),
      page: pageParam,
      pageSize: toValue(pageSize)
    })
  }
  )

  const query = useInfiniteQuery<
    PagedResponseExternalSkillDTO,
    BaseApiException,
    DeclaredSkillDTO[],
    Readonly<UnwrapRef<typeof queryKey>>,
    number
  >({
    queryKey,
    queryFn,
    enabled: computed(() => keyword.value.trim().length >= 3),
    initialPageParam: 0,
    getNextPageParam: (lastPage: PagedResponseExternalSkillDTO) => {
      const { page, totalPages } = lastPage.page
      return page + 1 < totalPages ? page + 1 : undefined
    },
    select: data => data.pages.flatMap(page => page.data)
  })

  const skills = computed(() => keyword.value.trim().length >= 3 ? (query.data.value ?? []) : [])

  return {
    ...query,
    skills,
  }
}

export function useCreateDeclaredSkillMutation ({ onError, onSuccess }: MutationArgs = {}) {
  const invalidateDeclaredSkillsViewQuery = useInvalidateQuery([...declaredSkillCommonQueryKey])

  return useMutation<void, BaseApiException, AddDeclaredSkillDTO>({
    mutationFn: async (addDeclaredSkillDTO: AddDeclaredSkillDTO): Promise<void> => {
      await createDeclaredSkillProgress(addDeclaredSkillDTO)
    },
    onSuccess: async (data, variables) => {
      await invalidateDeclaredSkillsViewQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface DeleteDeclaredSkillVariables {
  declaredSkillProgressId: string
}

export function useDeleteDeclaredSkillMutation ({ onError, onSuccess }: MutationArgs<string, DeleteDeclaredSkillVariables> = {}) {
  const invalidateDeclaredSkillsViewQuery = useInvalidateQuery([...declaredSkillCommonQueryKey])

  return useMutation<string, BaseApiException, DeleteDeclaredSkillVariables>({
    mutationFn: async ({ declaredSkillProgressId }: DeleteDeclaredSkillVariables): Promise<string> => {
      return await deleteDeclaredSkillProgress(declaredSkillProgressId)
    },
    onSuccess: async (data, variables) => {
      await invalidateDeclaredSkillsViewQuery()
      onSuccess?.(data, variables)
    },
    onError
  })
}

export function useDeclaredSkillDetailedQuery (skillId: MaybeRef<string>) {
  const queryKey = computed(() => [...declaredSkillDetailsQueryKey, toValue(skillId)])

  const queryFn = computed(() => async (): Promise<DeclaredSkillProgressDetailsDTO> => {
    return await getDeclaredSkillProgressDetails(toValue(skillId))
  })

  const query = useQuery<DeclaredSkillProgressDetailsDTO, BaseApiException, DeclaredSkillProgressDetailsDTO, readonly unknown[]>({
    queryKey,
    queryFn,
    enabled: computed(() => toValue(skillId).trim().length > 0),
  })

  const declaredSkillDetailed = computed(() => query.data.value)

  return {
    ...query,
    declaredSkillDetailed,
  }
}

export function useUpdateDeclaredSkillMutation ({ onError, onSuccess }: MutationArgs = {}) {
  const invalidateQueryKey = useInvalidateQuery()

  return useMutation<void, BaseApiException, DeclaredSkillProgressDetailsDTO>({
    mutationFn: async (declaredSkillProgressDetailsDTO: DeclaredSkillProgressDetailsDTO): Promise<void> => {
      const declaredSkillProgressRequest: DeclaredSkillProgressRequest = {
        level: declaredSkillProgressDetailsDTO.level,
        reflection: declaredSkillProgressDetailsDTO.reflection ?? '',
      }
      await updateDeclaredSkillProgress(declaredSkillProgressDetailsDTO.id, declaredSkillProgressRequest)
    },
    onSuccess: async (data, variables) => {
      await invalidateQueryKey([...declaredSkillDetailsQueryKey, variables.id])
      onSuccess?.(data, variables)
    },
    onError
  })
}

export interface UseUnassociateTracesFromDeclaredSkillMutationVariables {
  declaredSkillProgressId: string
  traceIds: string[]
}

export function useUnassociateTracesFromDeclaredSkillMutation ({ onError, onSuccess }: MutationArgs<
  string,
  UseUnassociateTracesFromDeclaredSkillMutationVariables
>) {
  const invalidateQueryKey = useInvalidateQuery()

  return useMutation<string, BaseApiException, UseUnassociateTracesFromDeclaredSkillMutationVariables>({
    mutationFn: async ({ declaredSkillProgressId, traceIds }: UseUnassociateTracesFromDeclaredSkillMutationVariables): Promise<string> => {
      return await unassociateTraces(declaredSkillProgressId, traceIds)
    },
    onSuccess: async (data, variables) => {
      await invalidateQueryKey([...declaredSkillDetailsQueryKey, variables.declaredSkillProgressId])
      onSuccess?.(data, variables)
    },
    onError
  })
}
