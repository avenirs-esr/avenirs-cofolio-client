import type { TraceViewDTO } from '@/api/avenir-esr'
import { usePaginatedTraces } from '@/features/student/traces/composables/use-paginated-traces/use-paginated-traces'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('the usePaginatedTraces composable', () => {
  let composableResult: ReturnType<typeof usePaginatedTraces>

  const mountDefault = () => {
    vi.clearAllMocks()

    const { result } = mountComposable(
      () => usePaginatedTraces(),
      { useTanstack: true }
    )

    composableResult = result
  }

  BddTest().when('the first page is loaded', () => {
    beforeEach(async () => {
      mountDefault()

      await vi.waitFor(() => {
        expect(composableResult.traces.value.length).toBeGreaterThan(0)
      })
    })

    BddTest().then('it should load the first page into traces', () => {
      const traces = composableResult.traces.value

      expect(traces.length).toBe(10)
      expect(traces[0]).toHaveProperty('id')
      expect(composableResult.page.value).toBe(0)
    })

    BddTest().then('pageInfo should match paginated response', () => {
      const pageInfo = composableResult.pageInfo.value

      expect(pageInfo).toBeDefined()
      expect(pageInfo!.page).toBe(0)
      expect(pageInfo!.pageSize).toBe(10)
      expect(pageInfo!.totalElements).toBeGreaterThan(0)
      expect(pageInfo!.totalPages).toBeGreaterThan(0)
    })

    BddTest().then('hasMoreTraces should be true', () => {
      expect(composableResult.hasMoreTraces.value).toBe(true)
    })
  })

  BddTest().when('loadMoreTraces is called and more pages exist', () => {
    let firstPage: TraceViewDTO[]

    beforeEach(async () => {
      mountDefault()

      await vi.waitFor(() => {
        expect(composableResult.traces.value.length).toBe(10)
      })

      firstPage = [...composableResult.traces.value]

      composableResult.loadMoreTraces()

      await vi.waitFor(() => {
        expect(composableResult.traces.value.length).toBeGreaterThan(firstPage.length)
      })
    })

    BddTest().then('it should increment page index', () => {
      expect(composableResult.page.value).toBe(1)
    })

    BddTest().then('it should accumulate traces across pages', () => {
      const traces = composableResult.traces.value

      expect(traces.length).toBe(20)

      const uniqueIds = new Set(traces.map(trace => trace.id))
      expect(uniqueIds.size).toBe(traces.length)
    })
  })

  BddTest().when('resetPagination is called', () => {
    let pageAfterReset: number
    let lengthAfterReset: number

    beforeEach(async () => {
      mountDefault()

      await vi.waitFor(() => {
        expect(composableResult.traces.value.length).toBe(10)
      })

      composableResult.loadMoreTraces()

      await vi.waitFor(() => {
        expect(composableResult.page.value).toBe(1)
      })

      composableResult.resetPagination()

      pageAfterReset = composableResult.page.value
      lengthAfterReset = composableResult.traces.value.length
    })

    BddTest().then('it should reset page and clear traces', () => {
      expect(pageAfterReset).toBe(0)
      expect(lengthAfterReset).toBe(0)
    })
  })
})
