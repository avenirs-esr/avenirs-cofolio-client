import type { BaseApiException } from '@avenirs-esr/shared'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import type { PagedResponseTraceViewDTO, TraceViewDTO } from '@/api/avenir-esr'

type ExtendedUseQueryReturn = UseQueryReturnType<PagedResponseTraceViewDTO, BaseApiException> & {
  traces: Ref<TraceViewDTO[]>
  pageInfo: Ref<PagedResponseTraceViewDTO['page']>
  pages: Ref<number[]>
}

export function createMockedTracesViewQueryReturn (
  payload: PagedResponseTraceViewDTO | undefined,
  error: BaseApiException | null = null
): ExtendedUseQueryReturn {
  const mockData: Ref<PagedResponseTraceViewDTO | undefined> = ref(payload)
  const mockError: Ref<BaseApiException | null> = ref(error)

  const traces = computed(() => mockData.value?.data ?? [])
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
    traces,
    pageInfo,
    pages,
  } as unknown as ExtendedUseQueryReturn
}
