import type { BaseApiException } from '@/common/exceptions'
import { type AmsViewDTO, type AmsViewResponse, getAmsView, type PageInfo } from '@/api/avenir-esr'
import { skipToken, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import isNil from 'lodash-es/isNil'
import { type Ref, toValue } from 'vue'

const commonQueryKeys = ['user', 'student']

const TWO_MINUTES = 2 * 60 * 1000

export function useAmsViewQuery (
  programProgramId: Ref<string | undefined>,
  page: Ref<number>,
  pageSize: Ref<number>
): UseQueryReturnType<AmsViewResponse, BaseApiException> & {
  amss: Ref<AmsViewDTO[]>
  pageInfo: Ref<PageInfo>
} {
  const queryKey = computed(() => [...commonQueryKeys, 'ams', {
    programProgramId: programProgramId.value,
    page: page.value,
    pageSize: pageSize.value
  }])

  const queryFn = computed(() => !isNil(programProgramId.value)
    ? async (): Promise<AmsViewResponse> => {
      return await getAmsView({
        programProgressId: toValue(programProgramId)!,
        pageSize: toValue(pageSize),
        page: toValue(page.value),
      })
    }
    : skipToken)

  const query = useQuery<AmsViewResponse, BaseApiException, AmsViewResponse, readonly unknown[]>({
    queryKey,
    queryFn,
    enabled: computed(() => !isNil(programProgramId.value)),
    staleTime: TWO_MINUTES,
  })

  const amss = computed(() => query.data.value?.data ?? [])
  const pageInfo = computed(() => query.data.value?.page ?? { number: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  return {
    ...query,
    amss,
    pageInfo,
  }
}
