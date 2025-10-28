import type { BaseApiException } from '@/common/exceptions'
import type {
  AdditionalSkillProgressDetailsDTO
} from '@/features/student/views/StudentAdditionalSkillView/components/AdditionalSkillDetails/AdditionalSkillDetails.types'
import {
  updateMockedAdditionalSkillProgressDetails
} from '@/__mocks__/fixtures/student/skills.fixtures'
import {
  type AddAdditionalSkillDTO,
  type AdditionalSkillDTO,
  type AdditionalSkillProgressDetailsDTO,
  type AdditionalSkillProgressDTO,
  createAdditionalSkillProgress,
  getAdditionalSkillProgressDetails,
  getAdditionalSkillsProgresses,
  getAllSkills,
  getDetailedSkill,
  getSkillLevelProgresses,
  type PagedResponseAdditionalSkillDTO,
  type PagedResponseAdditionalSkillProgressDTO,
  type PagedResponseSkillDTO,
  type PageInfoDTO,
  searchAdditionalSkills,
  type SkillDetailedDTO,
  type SkillDTO,
  type SkillListItemDTO
} from '@/api/avenir-esr'
import { useInvalidateQuery } from '@/common/composables'
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue, type UnwrapRef } from 'vue'

const commonQueryKeys = ['user', 'student', 'skills']
const additionalSkillCommonQueryKey = ['user', 'student', 'additional-skills']

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

export function useSkillsViewQuery (
  sort: Ref<string | undefined>,
  page: Ref<number>,
  pageSize: Ref<number>
): UseQueryReturnType<PagedResponseSkillDTO, BaseApiException> & {
  skills: Ref<SkillDTO[]>
  pageInfo: Ref<PageInfoDTO>
} {
  const queryKey = computed(() => [...commonQueryKeys, 'education', {
    sort: sort.value,
    page: page.value,
    pageSize: pageSize.value
  }])

  const queryFn = computed(() => async (): Promise<PagedResponseSkillDTO> => {
    return await getSkillLevelProgresses({
      sort: toValue(sort),
      pageSize: toValue(pageSize),
      page: toValue(page.value),
    })
  })

  const query = useQuery<PagedResponseSkillDTO, BaseApiException, PagedResponseSkillDTO, readonly unknown[]>({
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
      return await createAdditionalSkillProgress(addAdditionalSkillDTO)
    },
    onSuccess: async () => {
      await invalidateAdditionalSkillsViewQuery()
      onSuccess?.()
    },
    onError
  })
}

export function useSkillDetailedQuery (skillId: Ref<string>) {
  const queryKey = computed(() => [...commonQueryKeys, 'skill-detailed', skillId.value])

  const queryFn = computed(() => async (): Promise<SkillDetailedDTO> => {
    return await getDetailedSkill(toValue(skillId))
  })

  const query = useQuery<SkillDetailedDTO, BaseApiException, SkillDetailedDTO, readonly unknown[]>({
    queryKey,
    queryFn,
    staleTime: TWO_MINUTES,
    enabled: computed(() => skillId.value.trim().length > 0),
  })

  const skillDetailed = computed(() => query.data.value)

  return {
    ...query,
    skillDetailed,
  }
}

export function useAllSkillsQuery () {
  const queryKey = computed(() => [...commonQueryKeys, 'all-skills'])

  const queryFn = computed(() => async (): Promise<SkillListItemDTO[]> => {
    return await getAllSkills()
  })

  const query = useQuery<SkillListItemDTO[], BaseApiException, SkillListItemDTO[], readonly unknown[]>({
    queryKey,
    queryFn,
    staleTime: TWO_MINUTES,
  })

  const allSkills = computed(() => query.data.value)

  return {
    ...query,
    allSkills,
  }
}

export function useAdditionalSkillDetailedQuery (skillId: MaybeRef<string>) {
  const queryKey = computed(() => [...additionalSkillCommonQueryKey, toValue(skillId)])

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
  const invalidateAdditionalSkillsViewQuery = useInvalidateQuery([...commonQueryKeys, 'update', 'additional'])

  return useMutation<void, BaseApiException, AdditionalSkillProgressDetailsDTO>({
    mutationFn: async (additionalSkillProgressDetailsDTO: AdditionalSkillProgressDetailsDTO): Promise<void> => {
      await updateMockedAdditionalSkillProgressDetails(additionalSkillProgressDetailsDTO)
    },
    onSuccess: async () => {
      await invalidateAdditionalSkillsViewQuery()
      onSuccess?.()
    },
    onError
  })
}
