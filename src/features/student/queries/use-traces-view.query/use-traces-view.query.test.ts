import type { TracesViewResponse } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { createMockedTracesViewResponse } from '@/features/student/queries/fixtures'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { useTracesViewQuery } from './use-traces-view.query'

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
      () => useTracesViewQuery(ref(1), ref(4))
    )

    await flushPromises()

    expect(data.value).toEqual(mockedData)
    expect(data.value?.data.traces).toHaveLength(4)
    expect(data.value?.page.number).toBe(1)
    expect(data.value?.page.totalElements).toBe(20)
    expect(data.value?.page.totalPages).toBe(5)
  })
})
