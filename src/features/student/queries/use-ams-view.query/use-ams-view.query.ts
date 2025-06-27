import type { AmsViewDTO, AmsViewResponse, PageInfo } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { Ref } from 'vue'
import { createMockedAmsViewResponse } from '@/features/student/queries/fixtures'
import { skipToken, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import isNil from 'lodash-es/isNil'

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
      /*
      // TODO: Uncomment when the API is ready
      return await getAmsView({
        programProgressId: toValue(programProgramId)!,
        pageSize: toValue(pageSize),
        page: toValue(page.value),
      })
      */
      return createMockedAmsViewResponse(pageSize.value, 20, page.value, programProgramId.value!)
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
