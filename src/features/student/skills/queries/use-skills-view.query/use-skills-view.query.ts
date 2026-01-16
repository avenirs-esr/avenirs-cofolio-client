import type { BaseApiException } from '@/common/exceptions'
import {
  getAllSkills,
  getDetailedSkill,
  getSkillLevelProgresses,
  getStudentProgressOverview,
  type PagedResponseSkillDTO,
  type PageInfoDTO,
  type SkillDetailedDTO,
  type SkillDTO,
  type SkillListItemDTO,
  type StudentProgressOverviewDTO
} from '@/api/avenir-esr'
import { commonQueryKeys } from '@/features/student/global'
import { keepPreviousData, useQuery, type UseQueryDefinedReturnType, type UseQueryReturnType } from '@tanstack/vue-query'
import { type Ref, toValue } from 'vue'

const skillsCommonQueryKeys = [...commonQueryKeys, 'skills']

export function useSkillsViewQuery (
  sort: Ref<string | undefined>,
  page: Ref<number>,
  pageSize: Ref<number>
): UseQueryReturnType<PagedResponseSkillDTO, BaseApiException> & {
  skills: Ref<SkillDTO[]>
  pageInfo: Ref<PageInfoDTO>
} {
  const queryKey = computed(() => [...skillsCommonQueryKeys, 'education', {
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

export function useSkillDetailedQuery (skillId: Ref<string>) {
  const queryKey = computed(() => [...skillsCommonQueryKeys, 'skill-detailed', skillId.value])

  const queryFn = computed(() => async (): Promise<SkillDetailedDTO> => {
    return await getDetailedSkill(toValue(skillId))
  })

  const query = useQuery<SkillDetailedDTO, BaseApiException, SkillDetailedDTO, readonly unknown[]>({
    queryKey,
    queryFn,
    enabled: computed(() => skillId.value.trim().length > 0),
  })

  const skillDetailed = computed(() => query.data.value)

  return {
    ...query,
    skillDetailed,
  }
}

export function useAllSkillsQuery () {
  const queryKey = computed(() => [...skillsCommonQueryKeys, 'all-skills'])

  const queryFn = computed(() => async (): Promise<SkillListItemDTO[]> => {
    return await getAllSkills()
  })

  const query = useQuery<SkillListItemDTO[], BaseApiException, SkillListItemDTO[], readonly unknown[]>({
    queryKey,
    queryFn,
  })

  const allSkills = computed(() => query.data.value)

  return {
    ...query,
    allSkills,
  }
}

export function useStudentCoursesSummaryQuery (): UseQueryDefinedReturnType<StudentProgressOverviewDTO[], BaseApiException> {
  const queryKey = computed(() => [...skillsCommonQueryKeys, 'summary'])
  return useQuery<StudentProgressOverviewDTO[], BaseApiException>({
    queryKey,
    initialData: [],
    queryFn: async (): Promise<StudentProgressOverviewDTO[]> => {
      return getStudentProgressOverview()
    }
  })
}
