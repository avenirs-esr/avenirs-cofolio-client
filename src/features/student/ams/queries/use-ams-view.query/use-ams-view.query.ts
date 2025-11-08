import type { BaseApiException } from '@/common/exceptions'
import { type AmsViewDTO, getAmsView, type PagedResponseAmsViewDTO, type PageInfoDTO } from '@/api/avenir-esr'
import { commonQueryKeys } from '@/features/student/global'
import { keepPreviousData, skipToken, useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import isNil from 'lodash-es/isNil'
import { type Ref, toValue } from 'vue'

const amsCommonQueryKeys = [...commonQueryKeys, 'ams']

const TWO_MINUTES = 2 * 60 * 1000

export function useAmsViewQuery (
  programProgramId: Ref<string | undefined>,
  page: Ref<number>,
  pageSize: Ref<number>
): UseQueryReturnType<PagedResponseAmsViewDTO, BaseApiException> & {
  amss: Ref<AmsViewDTO[]>
  pageInfo: Ref<PageInfoDTO>
} {
  const queryKey = computed(() => [...amsCommonQueryKeys, {
    programProgramId: programProgramId.value,
    page: page.value,
    pageSize: pageSize.value
  }])

  const queryFn = computed(() => !isNil(programProgramId.value)
    ? async (): Promise<PagedResponseAmsViewDTO> => {
      return await getAmsView({
        studentProgressId: toValue(programProgramId)!,
        pageSize: toValue(pageSize),
        page: toValue(page.value),
      })
    }
    : skipToken)

  const query = useQuery<PagedResponseAmsViewDTO, BaseApiException, PagedResponseAmsViewDTO, readonly unknown[]>({
    queryKey,
    queryFn,
    enabled: computed(() => !isNil(programProgramId.value)),
    staleTime: TWO_MINUTES,
    placeholderData: keepPreviousData
  })

  const amss = computed(() => query.data.value?.data ?? [])
  const pageInfo = computed(() => query.data.value?.page ?? { page: 0, pageSize: 0, totalElements: 0, totalPages: 0 })

  return {
    ...query,
    amss,
    pageInfo,
  }
}
