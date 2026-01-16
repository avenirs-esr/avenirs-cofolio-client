import type { BaseApiException } from '@/common/exceptions'
import {
  type DeclaredExperienceViewDTO,
  getDeclaredExperienceView,
  type PagedResponseDeclaredExperienceViewDTO,
  type PageInfoDTO
} from '@/api/avenir-esr'
import { commonQueryKeys } from '@/features/student/global'
import { keepPreviousData, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { type MaybeRef, type Ref, toValue } from 'vue'

const declaredExperiencesCommonQueryKey = [...commonQueryKeys, 'declared-experiences']
const declaredExperiencesViewQueryKey = [...declaredExperiencesCommonQueryKey, 'view']

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
