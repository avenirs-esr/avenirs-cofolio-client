import type { AmsViewResponse } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { createMockedAmsViewResponse } from '@/features/student/queries/fixtures'
import { useAmsViewQuery } from '@/features/student/queries/use-ams-view.query/use-ams-view.query'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { describe, expect, it } from 'vitest'

describe('useAmsViewQuery', async () => {
  beforeEach(() => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return mocked amss data for given page and pageSize', async () => {
    const mockedData = createMockedAmsViewResponse(4, 20, 1)

    const { data } = mountQueryComposable<UseQueryReturnType<AmsViewResponse, BaseApiException>>(
      () => useAmsViewQuery(ref(1), ref(4))
    )

    await flushPromises()

    expect(data.value).toEqual(mockedData)
    expect(data.value?.data).toHaveLength(4)
    expect(data.value?.page?.number).toBe(1)
    expect(data.value?.page?.totalElements).toBe(20)
    expect(data.value?.page?.totalPages).toBe(5)
  })

  it('should return correct pages array', async () => {
    const page = ref(1)
    const pageSize = ref(4)

    const queryReturn = mountQueryComposable(() => useAmsViewQuery(page, pageSize))

    await flushPromises()

    expect(queryReturn.pageInfo.value.totalPages).toBe(5)
  })
})
