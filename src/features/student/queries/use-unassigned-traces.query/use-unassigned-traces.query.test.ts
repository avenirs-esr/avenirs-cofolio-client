import { getTracesView } from '@/api/avenir-esr'
import { PageSizes } from '@/config'
import { mockedTracesByPage, mockedTracesByPageSize12 } from '@/features/student/queries/fixtures'
import { flushPromises } from '@vue/test-utils'
import { mountQueryComposable } from 'tests/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useUnassignedTracesCriticalCount, useUnassignedTracesQuery } from './use-unassigned-traces.query'

vi.mock('@/api/avenir-esr', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/api/avenir-esr')>()
  return {
    ...actual,
    getTracesView: vi.fn()
  }
})

describe('useUnassignedTracesQuery', () => {
  const mockGetTracesView = vi.mocked(getTracesView)

  beforeEach(() => {
    vi.clearAllMocks()

    // Mock API response
    mockGetTracesView.mockImplementation(({ page = 0 } = {}) => {
      return Promise.resolve(mockedTracesByPage[page])
    })
  })

  it('should load initial page of unassigned traces', async () => {
    const pageSize = 4
    const result = mountQueryComposable(() => useUnassignedTracesQuery(pageSize))

    await flushPromises()

    expect(result.isLoading.value).toBe(false)
    const pages = result.data.value?.pages ?? []
    expect(pages).toHaveLength(1)

    expect(pages[0]).toHaveLength(4)
    const firstPage = pages[0]
    expect(firstPage[0].id).toBe('1')
    expect(firstPage[0].title).toBe('Unassigned Trace A')
    expect(firstPage[1].id).toBe('2')
    expect(firstPage[1].title).toBe('Unassigned Trace B')
    expect(firstPage[2].id).toBe('3')
    expect(firstPage[2].title).toBe('Unassigned Trace C')
    expect(firstPage[3].id).toBe('4')
    expect(firstPage[3].title).toBe('Unassigned Trace D')

    // TODO: Uncomment when the API is ready and mock is deleted
    /* expect(mockGetTracesView).toHaveBeenCalledWith({
      pageSize: 4,
      page: 0,
      status: TraceStatus.UNASSOCIATED
    })*/
  })

  it('should fetch next page when fetchNextPage is called', async () => {
    const pageSize = 4
    const result = mountQueryComposable(() => useUnassignedTracesQuery(pageSize))

    await flushPromises()
    expect(result.data.value?.pages).toHaveLength(1)

    await result.fetchNextPage()
    await flushPromises()
    const pages = result.data.value?.pages ?? []
    expect(result.data.value?.pages).toHaveLength(2)
    expect(pages[1]).toHaveLength(4)

    const secondPage = pages[1]

    expect(secondPage[0].id).toBe('5')
    expect(secondPage[0].title).toBe('Unassigned Trace E')
    expect(secondPage[1].id).toBe('6')
    expect(secondPage[1].title).toBe('Unassigned Trace F')
    expect(secondPage[2].id).toBe('7')
    expect(secondPage[2].title).toBe('Unassigned Trace G')
    expect(secondPage[3].id).toBe('8')
    expect(secondPage[3].title).toBe('Unassigned Trace H')

    /*
    TODO: Uncomment when the API is ready and mock is deleted
    expect(mockGetTracesView).toHaveBeenCalledWith({
      pageSize: 4,
      page: 1,
      status: TraceStatus.UNASSOCIATED
    })*/
  })

  it('should handle all pages correctly', async () => {
    const pageSize = 4
    const result = mountQueryComposable(() => useUnassignedTracesQuery(pageSize))

    // Load all pages
    await flushPromises()
    await result.fetchNextPage()
    await flushPromises()
    await result.fetchNextPage()
    await flushPromises()
    const pages = result.data.value?.pages
    expect(pages).toHaveLength(3)

    // Page 0: items 1-4
    const firstPage = pages?.[0] ?? []
    expect(firstPage).toHaveLength(4)
    expect(firstPage[0].id).toBe('1')
    expect(firstPage[3].id).toBe('4')

    // Page 1: items 5-8
    const secondPage = pages?.[1] ?? []
    expect(secondPage).toHaveLength(4)
    expect(secondPage[0].id).toBe('5')
    expect(secondPage[3].id).toBe('8')

    // Page 2: items 9-12
    const thirdPage = pages?.[2] ?? []
    expect(thirdPage).toHaveLength(4)
    expect(thirdPage[0].id).toBe('9')
    expect(thirdPage[3].id).toBe('12')

    /*
    TODO: Uncomment when the API is ready and mock is deleted
    expect(mockGetTracesView).toHaveBeenCalledTimes(3)
    */
  })

  it('should handle empty page after all data is loaded', async () => {
    const pageSize = 4
    const result = mountQueryComposable(() => useUnassignedTracesQuery(pageSize))

    await flushPromises()
    await result.fetchNextPage()
    await flushPromises()
    await result.fetchNextPage()
    await flushPromises()
    await result.fetchNextPage()
    await flushPromises()

    expect(result.data.value?.pages).toHaveLength(3)
    expect(result.hasNextPage.value).toBe(false)

    /*
    TODO: Uncomment when the API is ready and mock is deleted
    expect(mockGetTracesView).toHaveBeenCalledTimes(3)
    */
  })

  it('should not allow fetching another page', async () => {
    const pageSize = 12

    mockGetTracesView.mockImplementation(({ page = 0 } = {}) => {
      return Promise.resolve(mockedTracesByPageSize12[page])
    })

    const result = mountQueryComposable(() => useUnassignedTracesQuery(pageSize))

    await flushPromises()

    expect(result.hasNextPage.value).toBe(false)

    /*
    TODO: Uncomment when the API is ready and mock is deleted
    expect(mockGetTracesView).toHaveBeenCalledTimes(1)
    */
  })

  it('should call API with different page sizes', async () => {
    const pageSize = 8

    mountQueryComposable(() => useUnassignedTracesQuery(pageSize))

    await flushPromises()

    /*
    TODO: Uncomment when the API is ready and mock is deleted
    expect(mockGetTracesView).toHaveBeenCalledWith({
      pageSize: 8,
      page: 0,
      status: 'UNASSOCIATED'
    })*/
  })

  it('should transform API response correctly', async () => {
    const pageSize = 4
    const result = mountQueryComposable(() => useUnassignedTracesQuery(pageSize))

    await flushPromises()

    // Should return traces array, not the full API response
    const firstPage = result.data.value?.pages[0]
    expect(firstPage).toEqual(mockedTracesByPage[0].data.traces)
  })
})

describe('useUnassignedTracesCriticalCount', () => {
  const mockGetTracesView = vi.mocked(getTracesView)

  beforeEach(() => {
    vi.clearAllMocks()

    mockGetTracesView.mockResolvedValue({
      data: {
        traces: [],
        criticalCount: 12
      },
      page: {
        number: 0,
        size: 4,
        totalElements: 12,
        totalPages: 3
      }
    })
  })

  it('should return critical count from API response', async () => {
    const useUnassignedTracesQueryAndCriticalCount = () => {
      useUnassignedTracesQuery(PageSizes.FOUR)
      return useUnassignedTracesCriticalCount()
    }
    const result = mountQueryComposable(() => useUnassignedTracesQueryAndCriticalCount())

    await flushPromises()

    expect(result.isLoading.value).toBe(false)
    expect(result.data.value).toBe(12)

    /*
    TODO: Uncomment when the API is ready and mock is deleted
    expect(mockGetTracesView).toHaveBeenCalledWith({
      page: 0,
      status: 'UNASSOCIATED'
    })*/
  })

  it('should handle undefined critical count', async () => {
    mockGetTracesView.mockResolvedValue({
      data: {
        traces: [],
        criticalCount: undefined
      },
      page: {
        number: 0,
        size: 4,
        totalElements: 0,
        totalPages: 1
      }
    })

    const result = mountQueryComposable(() => useUnassignedTracesCriticalCount())

    await flushPromises()

    expect(result.data.value).toBeUndefined()
  })
})
