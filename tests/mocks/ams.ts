import type { AmsViewDTO, AmsViewResponse, PageInfo } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'

type ExtendedUseQueryReturn = UseQueryReturnType<AmsViewResponse, BaseApiException> & {
  amss: Ref<AmsViewDTO[]>
  pageInfo: Ref<PageInfo>
  pages: Ref<number[]>
}

export function createMockedAmsViewQueryReturn (
  payload: AmsViewResponse | undefined,
  error: BaseApiException | null = null
): ExtendedUseQueryReturn {
  const mockData: Ref<AmsViewResponse | undefined> = ref(payload)
  const mockError: Ref<BaseApiException | null> = ref(error)

  const amss = computed(() => mockData.value?.data ?? [])
  const pageInfo = computed(() => mockData.value?.page ?? {
    number: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
  })
  const pages = computed(() => Array.from({ length: pageInfo.value.totalPages }, (_, i) => i + 1))

  return {
    data: mockData,
    error: mockError,
    amss,
    pageInfo,
    pages,
  } as unknown as ExtendedUseQueryReturn
}
