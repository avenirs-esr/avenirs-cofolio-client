import type { BaseApiException } from '@/common/exceptions'
import { type AdditionalSkillDTO, type AdditionalSkillProgressDTO, getAdditionalSkillsProgresses, getSkillLevelProgresses, type PagedResponseAdditionalSkillDTO, type PagedResponseAdditionalSkillProgressDTO, type PagedResponseSkillDTO, type PageInfoDTO, type SkillDTO } from '@/api/avenir-esr'
import { keepPreviousData, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type Ref, toValue } from 'vue'

const commonQueryKeys = ['user', 'student', 'skills']

const TWO_MINUTES = 2 * 60 * 1000

export function useAdditionalSkillsViewQuery (
  keyword: Ref<string | undefined>,
  page: Ref<number>,
  pageSize: Ref<number>
): UseQueryReturnType<PagedResponseAdditionalSkillDTO | PagedResponseAdditionalSkillProgressDTO, BaseApiException> & {
  skills: Ref<AdditionalSkillDTO[] | AdditionalSkillProgressDTO[]>
  pageInfo: Ref<PageInfoDTO>
} {
  const queryKey = computed(() => [...commonQueryKeys, 'additional', {
    keyword: keyword.value,
    page: page.value,
    pageSize: pageSize.value
  }])

  const queryFn = computed(() => async (): Promise<PagedResponseAdditionalSkillDTO | PagedResponseAdditionalSkillProgressDTO> => {
    return await getAdditionalSkillsProgresses({
      keyword: toValue(keyword)!,
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
