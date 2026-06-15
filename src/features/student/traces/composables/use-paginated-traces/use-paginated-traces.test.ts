import type { PageInfoDTO, TraceFilter, TraceViewDTO } from '@/api/avenir-esr'
import { useInfiniteScrollPagination } from '@/common/composables'
import { usePaginatedTraces } from '@/features/student/traces/composables/use-paginated-traces/use-paginated-traces'
import { useTracesViewQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, type MockedFunction, vi } from 'vitest'

vi.mock('@/features/student/traces/queries/use-traces.query/use-traces.query', async (importActual) => {
  const actual = await importActual<typeof import('@/features/student/traces/queries/use-traces.query/use-traces.query')>()
  return {
    ...actual,
    useTracesViewQuery: vi.fn()
  }
})

vi.mock('@/common/composables', async (importActual) => {
  const actual = await importActual<typeof import('@/common/composables')>()
  return {
    ...actual,
    useInfiniteScrollPagination: vi.fn()
  }
})

BddTest().given('a usePaginatedTraces composable', () => {
  const mockedUseTracesViewQuery: MockedFunction<typeof useTracesViewQuery> = vi.mocked(useTracesViewQuery)
  const mockedUseInfiniteScrollPagination: MockedFunction<typeof useInfiniteScrollPagination> = vi.mocked(useInfiniteScrollPagination)

  const fetchedTraces = ref<TraceViewDTO[]>([
    {
      id: 'trace-1',
      title: 'Trace 1',
      isAssociated: false,
      isDeletable: true,
      createdAt: '2026-06-15T10:00:00.000Z',
      updatedAt: '2026-06-15T10:00:00.000Z'
    }
  ])

  const fetchedPageInfo = ref<PageInfoDTO | undefined>({
    page: 0,
    pageSize: 10,
    totalElements: 1,
    totalPages: 1
  })

  const paginatedTraces = ref<TraceViewDTO[]>(fetchedTraces.value)
  const isFetching = ref(false)
  const hasMoreTraces = computed(() => false)
  const loadMoreTraces = vi.fn()
  const resetPagination = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    fetchedPageInfo.value = {
      page: 0,
      pageSize: 10,
      totalElements: 1,
      totalPages: 1
    }

    mockedUseTracesViewQuery.mockReturnValue({
      traces: fetchedTraces,
      pageInfo: fetchedPageInfo,
      isFetching
    } as ReturnType<typeof useTracesViewQuery>)

    mockedUseInfiniteScrollPagination.mockReturnValue({
      items: paginatedTraces,
      hasMoreItems: hasMoreTraces,
      loadMore: loadMoreTraces,
      resetPagination
    } as ReturnType<typeof useInfiniteScrollPagination>)
  })

  BddTest().when('the composable is used without options', () => {
    BddTest().then('it should call useTracesViewQuery with default params and empty filter', () => {
      mountComposable(() => usePaginatedTraces(), {})

      const queryParams = mockedUseTracesViewQuery.mock.calls[0][0]

      expect(queryParams.params.value).toEqual({
        page: 0,
        pageSize: 10
      })
      expect(queryParams.traceFilter.value).toEqual({})
      expect(queryParams.enabled).toBeUndefined()
    })

    BddTest().then('it should call useInfiniteScrollPagination with fetched traces and page info', () => {
      mountComposable(() => usePaginatedTraces(), {})

      const paginationParams = mockedUseInfiniteScrollPagination.mock.calls[0][0]

      expect(paginationParams.fetchedItems).toBe(fetchedTraces)
      expect(paginationParams.pageInfo.value).toEqual(fetchedPageInfo.value)
      expect(paginationParams.isFetching).toBe(isFetching)
      expect(paginationParams.page.value).toBe(0)
    })

    BddTest().then('it should return pagination values', () => {
      const { result } = mountComposable(() => usePaginatedTraces(), {})

      expect(result.traces).toBe(paginatedTraces)
      expect(result.pageInfo.value).toEqual(fetchedPageInfo.value)
      expect(result.page.value).toBe(0)
      expect(result.isFetching).toBe(isFetching)
      expect(result.hasMoreTraces).toBe(hasMoreTraces)
      expect(result.loadMoreTraces).toBe(loadMoreTraces)
      expect(result.resetPagination).toBe(resetPagination)
    })
  })

  BddTest().when('the composable is used with options', () => {
    BddTest().then('it should call useTracesViewQuery with provided page size, filter and enabled', () => {
      const enabled = computed(() => true)
      const pageSize = ref(25)
      const traceFilter = ref<TraceFilter>({
        isAssociated: true
      })

      mountComposable(() => usePaginatedTraces({
        enabled,
        pageSize,
        traceFilter
      }), {})

      const queryParams = mockedUseTracesViewQuery.mock.calls[0][0]

      expect(queryParams.params.value).toEqual({
        page: 0,
        pageSize: 25
      })
      expect(queryParams.traceFilter.value).toEqual({
        isAssociated: true
      })
      expect(queryParams.enabled).toBe(enabled)
    })
  })

  BddTest().when('fetched page info is undefined', () => {
    BddTest().then('it should expose default page info', () => {
      fetchedPageInfo.value = undefined

      mountComposable(() => usePaginatedTraces(), {})

      const paginationParams = mockedUseInfiniteScrollPagination.mock.calls[0][0]

      expect(paginationParams.pageInfo.value).toEqual({
        page: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0
      })
    })
  })
})
