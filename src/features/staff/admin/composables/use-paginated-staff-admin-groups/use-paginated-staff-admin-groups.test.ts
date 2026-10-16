import type { PagedResponseGroupOverviewDTO } from '@/api/avenir-esr'
import { mockGroupOverview, mockGroupOverviewWithParent } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { BaseApiException } from '@/common/exceptions'
import { usePaginatedStaffAdminGroups } from '@/features/staff/admin/composables/use-paginated-staff-admin-groups/use-paginated-staff-admin-groups'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { keepPreviousData } from '@tanstack/vue-query'
import { mountComposable } from 'tests/utils'
import { nextTick, unref } from 'vue'

const groups = [mockGroupOverview, mockGroupOverviewWithParent]

const page: PagedResponseGroupOverviewDTO = {
  data: groups,
  page: {
    page: 0,
    pageSize: PageSizes.TWELVE,
    totalElements: groups.length,
    totalPages: 1,
  },
}

const mockError = new BaseApiException('error')

function makeMockFetchFn (overrides?: {
  data?: ReturnType<typeof ref<PagedResponseGroupOverviewDTO | undefined>>
  error?: ReturnType<typeof ref<BaseApiException | null>>
  isFetching?: ReturnType<typeof ref<boolean>>
}) {
  return vi.fn().mockReturnValue({
    data: overrides?.data ?? ref(page),
    error: overrides?.error ?? ref(null),
    isFetching: overrides?.isFetching ?? ref(false),
  })
}

function mountUsePaginatedStaffAdminGroups ({
  fetchFn = makeMockFetchFn(),
  currentPage = 0,
  pageSize = PageSizes.TWELVE,
}: {
  fetchFn?: ReturnType<typeof makeMockFetchFn>
  currentPage?: number
  pageSize?: PageSizes
} = {}) {
  return mountComposable(() =>
    usePaginatedStaffAdminGroups({
      currentPageRef: ref(currentPage),
      pageSizeRef: ref(pageSize),
      fetchFn,
    }), {}).result
}

BddTest().given('a usePaginatedStaffAdminGroups composable', () => {
  BddTest().when('fetchFn returns valid data', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAdminGroups>

    beforeEach(() => {
      result = mountUsePaginatedStaffAdminGroups()
    })

    BddTest().then('it should return groups and pageInfo from data', () => {
      expect(result.groups.value).toEqual(page.data)
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
    let result: ReturnType<typeof mountUsePaginatedStaffAdminGroups>

    beforeEach(() => {
      fetchFn = makeMockFetchFn()
      result = mountUsePaginatedStaffAdminGroups({ fetchFn, pageSize: PageSizes.FOUR })
    })

    BddTest().then('it should call with the correct params', () => {
      const [params, options] = fetchFn.mock.calls[0]

      expect(unref(params)).toEqual({
        page: 0,
        pageSize: PageSizes.FOUR,
      })

      expect(options).toEqual(
        expect.objectContaining({
          query: expect.objectContaining({
            placeholderData: keepPreviousData,
          }),
        }),
      )
    })

    BddTest().then('it should refetch with the new page', async () => {
      result.onUpdateCurrentPage(1)
      await nextTick()

      const [params, options] = fetchFn.mock.calls.at(-1)!

      expect(unref(params)).toEqual({
        page: 1,
        pageSize: PageSizes.FOUR,
      })

      expect(options).toEqual(
        expect.objectContaining({
          query: expect.objectContaining({
            placeholderData: keepPreviousData,
          }),
        }),
      )
    })

    BddTest().then('it should refetch with the new page size', async () => {
      result.onUpdatePageSize(PageSizes.EIGHT)
      await nextTick()

      const [params, options] = fetchFn.mock.calls.at(-1)!

      expect(unref(params)).toEqual({
        page: 0,
        pageSize: PageSizes.EIGHT,
      })

      expect(options).toEqual(
        expect.objectContaining({
          query: expect.objectContaining({
            placeholderData: keepPreviousData,
          }),
        }),
      )
    })
  })

  BddTest().when('fetchFn returns isFetching as true', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAdminGroups>

    beforeEach(() => {
      result = mountUsePaginatedStaffAdminGroups({
        fetchFn: makeMockFetchFn({ isFetching: ref(true) }),
      })
    })

    BddTest().then('it should return isFetching as true', () => {
      expect(result.isFetching.value).toBe(true)
    })
  })

  BddTest().when('fetchFn returns undefined data and an error', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffAdminGroups>

    beforeEach(() => {
      result = mountUsePaginatedStaffAdminGroups({
        fetchFn: makeMockFetchFn({
          data: ref(undefined),
          error: ref(mockError),
        }),
      })
    })

    BddTest().then('it should return empty groups and undefined pageInfo', () => {
      expect(result.groups.value).toEqual([])
      expect(result.pageInfo.value).toBeUndefined()
    })

    BddTest().then('it should return an error', () => {
      expect(result.error.value).toBe(mockError)
    })
  })
})
