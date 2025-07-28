import type { AmsViewDTO, PagedResponseAmsViewDTO, PageInfoDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'

type ExtendedUseQueryReturn = UseQueryReturnType<PagedResponseAmsViewDTO, BaseApiException> & {
  amss: Ref<AmsViewDTO[]>
  pageInfo: Ref<PageInfoDTO>
  pages: Ref<number[]>
}

export function createMockedAmsViewQueryReturn (
  payload: PagedResponseAmsViewDTO | undefined,
  error: BaseApiException | null = null
): ExtendedUseQueryReturn {
  const mockData: Ref<PagedResponseAmsViewDTO | undefined> = ref(payload)
  const mockError: Ref<BaseApiException | null> = ref(error)

  const amss = computed(() => mockData.value?.data ?? [])
  const pageInfo = computed(() => mockData.value?.page ?? {
    page: 0,
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
