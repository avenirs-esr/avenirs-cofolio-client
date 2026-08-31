import type { PagedResponseActivityStaffOverviewDTO } from '@/api/avenir-esr'
import { createMockedPagedResponseActivityStaffOverviewDTO } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { BaseApiException } from '@/common/exceptions'
import { usePaginatedStaffActivities } from '@/features/activities/composables/use-paginated-staff-activites/use-paginated-staff-activites'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { keepPreviousData } from '@tanstack/vue-query'
import { mountComposable } from 'tests/utils'
import { nextTick, unref } from 'vue'

const page = createMockedPagedResponseActivityStaffOverviewDTO(PageSizes.TWELVE, 6, 0)

const mockError = new BaseApiException('error')

function makeMockFetchFn (overrides?: {
  data?: ReturnType<typeof ref<PagedResponseActivityStaffOverviewDTO | undefined>>
  error?: ReturnType<typeof ref<BaseApiException | null>>
  isFetching?: ReturnType<typeof ref<boolean>>
}) {
  return vi.fn().mockReturnValue({
    data: overrides?.data ?? ref<PagedResponseActivityStaffOverviewDTO>(page),
    error: overrides?.error ?? ref(null),
    isFetching: overrides?.isFetching ?? ref(false),
  })
}

function mountUsePaginatedStaffActivites ({
  fetchFn = makeMockFetchFn(),
  currentPage = 0,
  pageSize = PageSizes.TWELVE
}: {
  fetchFn?: ReturnType<typeof makeMockFetchFn>
  currentPage?: number
  pageSize?: PageSizes
} = {}) {
  return mountComposable(() => usePaginatedStaffActivities({
    currentPageRef: ref(currentPage),
    pageSizeRef: ref(pageSize),
    fetchFn,
  }), {}).result
}

BddTest().given('a usePaginatedStaffActivites composable', () => {
  BddTest().when('fetchFn returns valid data', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffActivites>

    beforeEach(() => {
      result = mountUsePaginatedStaffActivites()
    })

    BddTest().then('it should return activities and pageInfo from data', () => {
      expect(result.activities.value).toEqual(page.data)
      expect(result.pageInfo.value).toEqual(page.page)
    })

    BddTest().then('it should return isFetching as false', () => {
      expect(result.isFetching.value).toBe(false)
    })

    BddTest().then('it should return no error', () => {
      expect(result.error.value).toBeNull()
    })

    BddTest().then('it should expose pageSizeSelected, onUpdateCurrentPage and onUpdatePageSize', () => {
      expect(result.pageSizeSelected.value).toBe(PageSizes.TWELVE)
      expect(typeof result.onUpdateCurrentPage).toBe('function')
      expect(typeof result.onUpdatePageSize).toBe('function')
    })
  })

  BddTest().when('fetchFn is called', () => {
    let fetchFn: ReturnType<typeof makeMockFetchFn>
    let result: ReturnType<typeof mountUsePaginatedStaffActivites>

    beforeEach(() => {
      fetchFn = makeMockFetchFn()
      result = mountUsePaginatedStaffActivites({ fetchFn, pageSize: PageSizes.FOUR })
    })

    BddTest().then('it should call with the correct params', () => {
      const [params, options] = fetchFn.mock.calls[0]

      expect(unref(params)).toEqual(
        expect.objectContaining({
          page: 0,
          pageSize: PageSizes.FOUR,
        })
      )

      expect(options).toEqual(
        expect.objectContaining({
          query: expect.objectContaining({
            placeholderData: keepPreviousData,
          })
        })
      )
    })

    BddTest().then('it should refetch with new page', async () => {
      result.onUpdateCurrentPage(1)
      await nextTick()

      const [params, options] = fetchFn.mock.calls.at(-1)!

      expect(unref(params)).toEqual(
        expect.objectContaining({
          page: 1,
          pageSize: PageSizes.FOUR,
        })
      )

      expect(options).toEqual(
        expect.objectContaining({
          query: expect.objectContaining({
            placeholderData: keepPreviousData,
          })
        })
      )
    })
  })

  BddTest().when('fetchFn returns isFetching as true', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffActivites>

    beforeEach(() => {
      result = mountUsePaginatedStaffActivites({ fetchFn: makeMockFetchFn({ isFetching: ref(true) }) })
    })

    BddTest().then('it should return isFetching as true', () => {
      expect(result.isFetching.value).toBe(true)
    })
  })

  BddTest().when('fetchFn returns undefined data and an error', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffActivites>

    beforeEach(() => {
      result = mountUsePaginatedStaffActivites({
        fetchFn: makeMockFetchFn({ data: ref(undefined), error: ref(mockError) })
      })
    })

    BddTest().then('it should return empty activities and undefined pageInfo', () => {
      expect(result.activities.value).toEqual([])
      expect(result.pageInfo.value).toBeUndefined()
    })

    BddTest().then('it should return an error', () => {
      expect(result.error.value).toBe(mockError)
    })
  })
})
