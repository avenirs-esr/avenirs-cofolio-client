import type { TracesViewResponse } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UnassignedTracesSummaryDTO } from '@/types'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { createMockedTracesViewResponse, mockedUnassignedTracesSummary } from '@/features/student/queries/fixtures'
import { useUnassignedTracesSummaryQuery, useUnassignedTracesViewQuery } from '@/features/student/queries/use-traces-view.query/use-traces-view.query'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'

describe('useTracesViewQuery', async () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return mocked traces data for given page and pageSize', async () => {
    const mockedData = createMockedTracesViewResponse(4, 20, 1)

    const { data } = mountQueryComposable<UseQueryReturnType<TracesViewResponse, BaseApiException>>(
      () => useUnassignedTracesViewQuery(ref(1), ref(4))
    )

    await flushPromises()

    expect(data.value).toEqual(mockedData)
    expect(data.value?.data.traces).toHaveLength(4)
    expect(data.value?.page.number).toBe(1)
    expect(data.value?.page.totalElements).toBe(20)
    expect(data.value?.page.totalPages).toBe(5)
  })

  it('should return correct pages array', async () => {
    const page = ref(1)
    const pageSize = ref(4)

    const queryReturn = mountQueryComposable(() => useUnassignedTracesViewQuery(page, pageSize))

    await flushPromises()

    expect(queryReturn.pageInfo.value.totalPages).toBe(5)
  })

  it('should return mockedUnassignedTracesSummary when API is not yet connected', async () => {
    const { data } = mountQueryComposable<UseQueryReturnType<UnassignedTracesSummaryDTO, BaseApiException>>(
      () => useUnassignedTracesSummaryQuery()
    )

    await flushPromises()

    expect(data.value).toEqual(mockedUnassignedTracesSummary)
  })
})
