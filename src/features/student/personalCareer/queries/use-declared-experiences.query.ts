import type { BaseApiException } from '@/common/exceptions'
import {
  type DeclaredExperienceViewDTO,
  getDeclaredExperience,
  getDeclaredExperienceView,
  type PagedResponseDeclaredExperienceViewDTO,
  type PageInfoDTO
} from '@/api/avenir-esr'
import { commonQueryKeys } from '@/features/student/global'
import { keepPreviousData, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue } from 'vue'

const declaredExperiencesCommonQueryKey = [...commonQueryKeys, 'declared-experiences']
const declaredExperiencesViewQueryKey = [...declaredExperiencesCommonQueryKey, 'view']

const declaredExperienceDetailedCommonQueryKey = [...commonQueryKeys, 'declared-experience-detailed']
const declaredExperienceDetailedViewQueryKey = [...declaredExperienceDetailedCommonQueryKey, 'view']

export interface DeclaredExperiencesViewQueryParams {
  page: MaybeRef<number>
  pageSize: MaybeRef<number>
}

export type DeclaredExperiencesViewQueryReturnType = UseQueryReturnType<PagedResponseDeclaredExperienceViewDTO, BaseApiException> & {
  declaredExperiences: Ref<DeclaredExperienceViewDTO[]>
  pageInfo: Ref<PageInfoDTO>
}

export function useDeclaredExperiencesViewQuery ({
  page,
  pageSize
}: DeclaredExperiencesViewQueryParams): DeclaredExperiencesViewQueryReturnType {
  const queryKey = computed(() => [...declaredExperiencesViewQueryKey, {
    page: toValue(page),
    pageSize: toValue(pageSize)
  }])

  const queryFn = computed(() => async (): Promise<PagedResponseDeclaredExperienceViewDTO> => {
    return await getDeclaredExperienceView({
      page: toValue(page),
      pageSize: toValue(pageSize)
    })
  })

  const query = useQuery<PagedResponseDeclaredExperienceViewDTO, BaseApiException>({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData
  })

  const declaredExperiences = computed(() => query.data.value?.data ?? [])
  const pageInfo = computed(() => query.data.value?.page ?? { page: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  return {
    ...query,
    declaredExperiences,
    pageInfo
  }
}

export interface DeclaredExperienceDetailedViewQueryProps {
  experienceId: MaybeRef<string>
}

export type DeclaredExperienceDetailedViewQueryReturnType = UseQueryReturnType<DeclaredExperienceViewDTO, BaseApiException> & {
  declaredExperience: Ref<DeclaredExperienceViewDTO | undefined>
}

export function useDeclaredExperienceDetailedViewQuery ({ experienceId }: DeclaredExperienceDetailedViewQueryProps): DeclaredExperienceDetailedViewQueryReturnType {
  const queryKey = computed(() => [...declaredExperienceDetailedViewQueryKey, toValue(experienceId)])

  const queryFn = computed(() => async (): Promise<DeclaredExperienceViewDTO> => {
    return await getDeclaredExperience(toValue(experienceId))
  })

  const query = useQuery<DeclaredExperienceViewDTO, BaseApiException>({
    queryKey,
    queryFn,
    placeholderData: keepPreviousData
  })

  const declaredExperience = computed(() => query.data.value ?? undefined)

  return {
    ...query,
    declaredExperience,
  }
}
