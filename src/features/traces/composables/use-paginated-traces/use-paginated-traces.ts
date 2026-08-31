import {
  type PageInfoDTO,
  type TraceFilter,
  type TracesViewParams,
  type TraceViewDTO,
  useTracesView
} from '@/api/avenir-esr'
import { useInfiniteScrollPagination } from '@/common/composables'
import { type ComputedRef, type Ref, toValue } from 'vue'

export interface UsePaginatedTracesResult {
  traces: Ref<TraceViewDTO[]>
  pageInfo: Ref<PageInfoDTO | undefined>
  page: Ref<number>
  isFetching: Ref<boolean>
  loadMoreTraces: () => void
  resetPagination: () => void
  hasMoreTraces: ComputedRef<boolean>
}

export function usePaginatedTraces (
  {
    enabled,
    pageSize,
    traceFilter,
  }: {
    enabled?: ComputedRef<boolean>
    pageSize?: Ref<number>
    traceFilter?: Ref<TraceFilter>
  } = {}
): UsePaginatedTracesResult {
  const page = ref(0)

  const params = computed<TracesViewParams>(() => ({
    page: toValue(page),
    pageSize: toValue(pageSize) ?? 10,
  }))

  const resolvedTraceFilter = computed<TraceFilter>(() => toValue(traceFilter) ?? {})

  const { data, isFetching } = useTracesView(resolvedTraceFilter, params, { query: { enabled: enabled ?? true } })

  const fetchedTraces = computed(() => data.value?.data ?? [])
  const fetchedPageInfo = computed(() => data.value?.page)

  const pageInfo = computed(() =>
    fetchedPageInfo.value ?? {
      page: page.value,
      pageSize: 10,
      totalElements: 0,
      totalPages: 0
    }
  )

  const {
    items: traces,
    hasMoreItems: hasMoreTraces,
    loadMore: loadMoreTraces,
    resetPagination
  } = useInfiniteScrollPagination({
    fetchedItems: fetchedTraces,
    pageInfo,
    isFetching,
    page
  })

  return {
    traces,
    pageInfo,
    page,
    isFetching,
    hasMoreTraces,
    loadMoreTraces,
    resetPagination
  }
}
