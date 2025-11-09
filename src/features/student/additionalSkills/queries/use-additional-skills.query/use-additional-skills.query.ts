import type { BaseApiException } from '@/common/exceptions'
import type { MutationArgs } from '@/features/student/global/queries/types'
import {
  type AddAdditionalSkillDTO,
  type AdditionalSkillDTO,
  type AdditionalSkillProgressDetailsDTO,
  type AdditionalSkillProgressDTO,
  type AdditionalSkillProgressRequest,
  createAdditionalSkillProgress,
  getAdditionalSkillProgressDetails,
  getAdditionalSkillsProgresses,
  type PagedResponseAdditionalSkillDTO,
  type PagedResponseAdditionalSkillProgressDTO,
  type PageInfoDTO,
  searchAdditionalSkills,
  unassociateTraces,
  updateAdditionalSkillProgress
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue, type UnwrapRef } from 'vue'

const additionalSkillCommonQueryKey = ['user', 'student', 'additional-skills']
const additionalSkillDetailsQueryKey = [...additionalSkillCommonQueryKey, 'details']

const TWO_MINUTES = 2 * 60 * 1000

export function useAdditionalSkillsViewQuery (
  page: Ref<number>,
  pageSize: Ref<number>
): UseQueryReturnType<PagedResponseAdditionalSkillDTO | PagedResponseAdditionalSkillProgressDTO, BaseApiException> & {
  skills: Ref<AdditionalSkillDTO[] | AdditionalSkillProgressDTO[]>
  pageInfo: Ref<PageInfoDTO>
} {
  const queryKey = computed(() => [...additionalSkillCommonQueryKey, 'view', {
    page: page.value,
    pageSize: pageSize.value
  }])

  const queryFn = computed(() => async (): Promise<PagedResponseAdditionalSkillDTO | PagedResponseAdditionalSkillProgressDTO> => {
    return await getAdditionalSkillsProgresses({
      pageSize: toValue(pageSize),
      page: toValue(page.value),
    })
  })

  const query = useQuery<
    PagedResponseAdditionalSkillDTO | PagedResponseAdditionalSkillProgressDTO,
    BaseApiException,
    PagedResponseAdditionalSkillDTO | PagedResponseAdditionalSkillProgressDTO,
    readonly unknown[]
  >({
    queryKey,
    queryFn,
    staleTime: TWO_MINUTES,
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

export function useSearchAdditionalSkillsQuery (
  keyword: Ref<string>,
  pageSize: Ref<number>
) {
  const queryKey = computed(() => [...additionalSkillCommonQueryKey, 'search-additional', {
    keyword: keyword.value,
    pageSize: pageSize.value
  }])

  const queryFn = computed(() => async ({ pageParam = 0 }): Promise<PagedResponseAdditionalSkillDTO> => {
    return await searchAdditionalSkills({
      keyword: toValue(keyword),
      page: pageParam,
      pageSize: toValue(pageSize)
    })
  }
  )

  const query = useInfiniteQuery<
    PagedResponseAdditionalSkillDTO,
    BaseApiException,
    AdditionalSkillDTO[],
    Readonly<UnwrapRef<typeof queryKey>>,
    number
  >({
    queryKey,
    queryFn,
    enabled: computed(() => keyword.value.trim().length >= 3),
    staleTime: TWO_MINUTES,
    initialPageParam: 0,
    getNextPageParam: (lastPage: PagedResponseAdditionalSkillDTO) => {
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

export interface UseCreateAdditionalSkillMutationArgs {
  onSuccess?: () => void
  onError?: (error: BaseApiException) => void
}

export function useCreateAdditionalSkillMutation ({ onError, onSuccess }: UseCreateAdditionalSkillMutationArgs = {}) {
  const invalidateAdditionalSkillsViewQuery = useInvalidateQuery([...additionalSkillCommonQueryKey])

  return useMutation<void, BaseApiException, AddAdditionalSkillDTO>({
    mutationFn: async (addAdditionalSkillDTO: AddAdditionalSkillDTO): Promise<void> => {
      await createAdditionalSkillProgress(addAdditionalSkillDTO)
    },
    onSuccess: async () => {
      await invalidateAdditionalSkillsViewQuery()
      onSuccess?.()
    },
    onError
  })
}

export function useAdditionalSkillDetailedQuery (skillId: MaybeRef<string>) {
  const queryKey = computed(() => [...additionalSkillDetailsQueryKey, toValue(skillId)])

  const queryFn = computed(() => async (): Promise<AdditionalSkillProgressDetailsDTO> => {
    return await getAdditionalSkillProgressDetails(toValue(skillId))
  })

  const query = useQuery<AdditionalSkillProgressDetailsDTO, BaseApiException, AdditionalSkillProgressDetailsDTO, readonly unknown[]>({
    queryKey,
    queryFn,
    staleTime: TWO_MINUTES,
    enabled: computed(() => toValue(skillId).trim().length > 0),
  })

  const additionalSkillDetailed = computed(() => query.data.value)

  return {
    ...query,
    additionalSkillDetailed,
  }
}

export interface UseUpdateAdditionalSkillMutationArgs {
  onSuccess?: () => void
  onError?: (error: BaseApiException) => void
}

export function useUpdateAdditionalSkillMutation ({ onError, onSuccess }: UseUpdateAdditionalSkillMutationArgs = {}) {
  const invalidateQueryKey = useInvalidateQuery()

  return useMutation<void, BaseApiException, AdditionalSkillProgressDetailsDTO>({
    mutationFn: async (additionalSkillProgressDetailsDTO: AdditionalSkillProgressDetailsDTO): Promise<void> => {
      const additionalSkillProgressRequest: AdditionalSkillProgressRequest = {
        level: additionalSkillProgressDetailsDTO.level,
        description: additionalSkillProgressDetailsDTO.description ?? '',
      }
      await updateAdditionalSkillProgress(additionalSkillProgressDetailsDTO.id, additionalSkillProgressRequest)
    },
    onSuccess: async (_, { id }) => {
      await invalidateQueryKey([...additionalSkillDetailsQueryKey, id])
      onSuccess?.()
    },
    onError
  })
}

export interface UseUnassociateTracesFromAdditionalSkillMutationVariables {
  additionalSkillProgressId: string
  traceIds: string[]
}

export function useUnassociateTracesFromAdditionalSkillMutation ({ onError, onSuccess }: MutationArgs<
  string,
  UseUnassociateTracesFromAdditionalSkillMutationVariables
>) {
  const invalidateQueryKey = useInvalidateQuery()

  return useMutation<string, BaseApiException, UseUnassociateTracesFromAdditionalSkillMutationVariables>({
    mutationFn: async ({ additionalSkillProgressId, traceIds }: UseUnassociateTracesFromAdditionalSkillMutationVariables): Promise<string> => {
      return await unassociateTraces(additionalSkillProgressId, traceIds)
    },
    onSuccess: async (data, variables) => {
      await invalidateQueryKey([...additionalSkillDetailsQueryKey, variables.additionalSkillProgressId])
      onSuccess?.(data, variables)
    },
    onError
  })
}
