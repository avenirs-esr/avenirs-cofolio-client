import { createMockedPagedResponseFeedbackStaffListItemDTO } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { EFeedbackStatus, type PagedResponseFeedbackStaffListItemDTO } from '@/api/avenir-esr'
import { BaseApiException } from '@/common/exceptions'
import { usePaginatedStaffFeedbacks } from '@/features/staff/feedbacks/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks'
import { PageSizes } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { keepPreviousData } from '@tanstack/vue-query'
import { mountComposable } from 'tests/utils'
import { nextTick, type Ref, unref } from 'vue'

const page = createMockedPagedResponseFeedbackStaffListItemDTO(PageSizes.TWELVE, 6, 0)

const mockError = new BaseApiException('error')

function makeMockFetchFn (overrides?: {
  data?: ReturnType<typeof ref<PagedResponseFeedbackStaffListItemDTO | undefined>>
  error?: ReturnType<typeof ref<BaseApiException | null>>
  isFetching?: ReturnType<typeof ref<boolean>>
}) {
  return vi.fn().mockReturnValue({
    data: overrides?.data ?? ref<PagedResponseFeedbackStaffListItemDTO>(page),
    error: overrides?.error ?? ref(null),
    isFetching: overrides?.isFetching ?? ref(false),
  })
}

function mountUsePaginatedStaffFeedbacks ({
  fetchFn = makeMockFetchFn(),
  currentPage = 0,
  pageSize = PageSizes.TWELVE,
  selectedActivityIdRef,
  selectedStatusRef,
}: {
  fetchFn?: ReturnType<typeof makeMockFetchFn>
  currentPage?: number
  pageSize?: PageSizes
  selectedActivityIdRef?: Ref<string | undefined>
  selectedStatusRef?: Ref<'ALL' | EFeedbackStatus>
} = {}) {
  return mountComposable(() =>
    usePaginatedStaffFeedbacks({
      currentPageRef: ref(currentPage),
      pageSizeRef: ref(pageSize),
      selectedActivityIdRef,
      selectedStatusRef,
      fetchFn,
    }), {}).result
}

BddTest().given('a usePaginatedStaffFeedbacks composable', () => {
  BddTest().when('fetchFn returns valid data', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffFeedbacks>

    beforeEach(() => {
      result = mountUsePaginatedStaffFeedbacks()
    })

    BddTest().then('it should return feedbacks and pageInfo from data', () => {
      expect(result.feedbacks.value).toEqual(page.data)
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
    let result: ReturnType<typeof mountUsePaginatedStaffFeedbacks>

    beforeEach(() => {
      fetchFn = makeMockFetchFn()
      result = mountUsePaginatedStaffFeedbacks({ fetchFn, pageSize: PageSizes.FOUR })
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

    BddTest().then('it should not filter by status when ALL is selected', () => {
      const fetchFn = makeMockFetchFn()

      mountUsePaginatedStaffFeedbacks({ fetchFn, pageSize: PageSizes.FOUR, selectedStatusRef: ref('ALL') })

      const [params] = fetchFn.mock.calls[0]

      expect(unref(params)).toEqual(
        expect.objectContaining({
          page: 0,
          pageSize: PageSizes.FOUR,
          statuses: undefined,
        })
      )
    })

    BddTest().then('it should request SUBMITTED and SEEN statuses when SUBMITTED is selected', () => {
      const fetchFn = makeMockFetchFn()

      mountUsePaginatedStaffFeedbacks({ fetchFn, pageSize: PageSizes.FOUR, selectedStatusRef: ref(EFeedbackStatus.SUBMITTED) })

      const [params] = fetchFn.mock.calls[0]

      expect(unref(params)).toEqual(
        expect.objectContaining({
          page: 0,
          pageSize: PageSizes.FOUR,
          statuses: [EFeedbackStatus.SUBMITTED, EFeedbackStatus.SEEN],
        })
      )
    })

    BddTest().then('it should not filter by activityId when none is selected', () => {
      const fetchFn = makeMockFetchFn()

      mountUsePaginatedStaffFeedbacks({ fetchFn, pageSize: PageSizes.FOUR })

      const [params] = fetchFn.mock.calls[0]

      expect(unref(params)).toEqual(
        expect.objectContaining({
          page: 0,
          pageSize: PageSizes.FOUR,
          activityId: undefined,
        })
      )
    })

    BddTest().then('it should filter by the selected activityId', () => {
      const fetchFn = makeMockFetchFn()

      mountUsePaginatedStaffFeedbacks({ fetchFn, pageSize: PageSizes.FOUR, selectedActivityIdRef: ref('activity-1') })

      const [params] = fetchFn.mock.calls[0]

      expect(unref(params)).toEqual(
        expect.objectContaining({
          page: 0,
          pageSize: PageSizes.FOUR,
          activityId: 'activity-1',
        })
      )
    })

    BddTest().then('it should combine activityId and status filters', () => {
      const fetchFn = makeMockFetchFn()

      mountUsePaginatedStaffFeedbacks({
        fetchFn,
        pageSize: PageSizes.FOUR,
        selectedActivityIdRef: ref('activity-1'),
        selectedStatusRef: ref(EFeedbackStatus.NEW),
      })

      const [params] = fetchFn.mock.calls[0]

      expect(unref(params)).toEqual(
        expect.objectContaining({
          activityId: 'activity-1',
          statuses: [EFeedbackStatus.NEW],
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

    BddTest().then('it should refetch with the new activityId when the selection changes', async () => {
      const fetchFn = makeMockFetchFn()
      const selectedActivityIdRef = ref<string | undefined>('activity-1')

      mountUsePaginatedStaffFeedbacks({ fetchFn, pageSize: PageSizes.FOUR, selectedActivityIdRef })

      selectedActivityIdRef.value = 'activity-2'
      await nextTick()

      const [params] = fetchFn.mock.calls.at(-1)!

      expect(unref(params)).toEqual(
        expect.objectContaining({
          activityId: 'activity-2',
        })
      )
    })
  })

  BddTest().when('fetchFn returns isFetching as true', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffFeedbacks>

    beforeEach(() => {
      result = mountUsePaginatedStaffFeedbacks({ fetchFn: makeMockFetchFn({ isFetching: ref(true) }) })
    })

    BddTest().then('it should return isFetching as true', () => {
      expect(result.isFetching.value).toBe(true)
    })
  })

  BddTest().when('fetchFn returns undefined data and an error', () => {
    let result: ReturnType<typeof mountUsePaginatedStaffFeedbacks>

    beforeEach(() => {
      result = mountUsePaginatedStaffFeedbacks({
        fetchFn: makeMockFetchFn({ data: ref(undefined), error: ref(mockError) })
      })
    })

    BddTest().then('it should return empty feedbacks and undefined pageInfo', () => {
      expect(result.feedbacks.value).toEqual([])
      expect(result.pageInfo.value).toBeUndefined()
    })

    BddTest().then('it should return an error', () => {
      expect(result.error.value).toBe(mockError)
    })
  })
})
