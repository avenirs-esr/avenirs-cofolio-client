import type { FeedbackStaffListItemDTO } from '@/api/avenir-esr'
import type { UsePaginatedStaffFeedbacksParams, UsePaginatedStaffFeedbacksResult } from '@/features/staff/feedbacks/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks'
import { createMockedPagedResponseFeedbackStaffListItemDTO } from '@/__mocks__/fixtures/staffs/feedbacks.fixtures'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { BaseApiException } from '@/common/exceptions'
import { FeedbackIterationBadgeStub } from '@/features/staff/feedbacks/components/badges/FeedbackIterationBadge/FeedbackIterationBadge.stub'
import { FeedbackStatusBadgeStub } from '@/features/staff/feedbacks/components/badges/FeedbackStatusBadge/FeedbackStatusBadge.stub'
import { FeedbackCardStub } from '@/features/staff/feedbacks/views/FeedbacksView/components/cards/FeedbackCard/FeedbackCard.stub'
import FeedbacksTable from '@/features/staff/feedbacks/views/FeedbacksView/components/FeedbacksTable/FeedbacksTable.vue'
import { type AvTableColumn, PageSizes } from '@avenirs-esr/avenirs-dsav'
import { AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockError = new BaseApiException('error')

const mockFormatLastModified = vi.fn((value: string) => `formatted-${value}`)
const mockFormatTranslatedDateTime = vi.fn((value: string) => `translated-${value}`)
const navigateToStaffActivityFeedbacks = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()

  return {
    ...actual,
    useDateUtils: () => ({
      formatLastModified: mockFormatLastModified,
      formatTranslatedDateTime: mockFormatTranslatedDateTime,
    }),
    useNavigation: () => ({
      navigateToStaffActivityFeedbacks
    }),
  }
})

const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({ isMobile: mockIsMobile }),
  }
})

const page = createMockedPagedResponseFeedbackStaffListItemDTO(PageSizes.TWELVE, 6, 0)

const defaultPaginatedResult: UsePaginatedStaffFeedbacksResult = {
  feedbacks: computed(() => page.data),
  pageInfo: computed(() => page.page),
  isFetching: ref(false),
  error: ref(null),
  pageSizeSelected: ref(PageSizes.TWELVE),
  onUpdateCurrentPage: vi.fn(),
  onUpdatePageSize: vi.fn(),
}

const mockUsePaginatedStaffFeedbacksParams: UsePaginatedStaffFeedbacksParams = {
  currentPageRef: ref(0),
  pageSizeRef: ref(PageSizes.TWELVE),
  fetchFn: vi.fn(),
}

vi.mock('@/features/staff/feedbacks/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks', () => ({
  usePaginatedStaffFeedbacks: vi.fn(),
}))

const { usePaginatedStaffFeedbacks: mockedUsePaginatedStaffFeedbacks } = await import('@/features/staff/feedbacks/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks')
const mockUsePaginatedStaffFeedbacks = vi.mocked(mockedUsePaginatedStaffFeedbacks)

BddTest().given('a FeedbacksTable component', () => {
  let wrapper: VueWrapper<InstanceType<typeof FeedbacksTable>>
  const stubs = {
    RouterLink: RouterLinkStub,
    FeedbackCard: FeedbackCardStub,
    FeedbackStatusBadge: FeedbackStatusBadgeStub,
    FeedbackIterationBadge: FeedbackIterationBadgeStub,
    AvTable: AvTableStub,
    Pagination: PaginationStub,
    QuerySuspense: QuerySuspenseStub
  }

  const mountDefault = async ({ props = {}, isMobile = false, paginatedResult = defaultPaginatedResult }: {
    props?: Record<string, unknown>
    isMobile?: boolean
    paginatedResult?: typeof defaultPaginatedResult
  } = {}) => {
    vi.clearAllMocks()
    mockIsMobile.value = isMobile
    mockUsePaginatedStaffFeedbacks.mockReturnValue(paginatedResult)

    wrapper = mountComponent(FeedbacksTable, {
      props: {
        emptyStateMessage: 'Aucun feedback',
        usePaginatedStaffFeedbacksParams: mockUsePaginatedStaffFeedbacksParams,
        ...props,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  beforeEach(async () => {
    await mountDefault()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should emit updateFeedbacksCount with the correct count', () => {
      expect(wrapper.emitted('updateFeedbacksCount')).toBeTruthy()
      expect(wrapper.emitted('updateFeedbacksCount')![0]).toEqual([3])
    })

    BddTest().then('it should emit updateFeedbacksCount with 0 when pageInfo is undefined', async () => {
      await mountDefault({
        paginatedResult: {
          ...defaultPaginatedResult,
          feedbacks: computed(() => []),
          pageInfo: computed(() => undefined),
        },
      })

      expect(wrapper.emitted('updateFeedbacksCount')).toBeTruthy()
      expect(wrapper.emitted('updateFeedbacksCount')![0]).toEqual([0])
    })
  })

  BddTest().when('the component is mounted in desktop view', () => {
    BddTest().then('it should display the title', () => {
      expect(wrapper.find('[data-testid="feedbacks-tab-title"]').text()).toBe('Toutes mes demandes de feedback (3)')
    })

    BddTest().then('it should render the pagination', () => {
      const pagination = wrapper.findComponent(PaginationStub)

      expect(pagination.exists()).toBe(true)
      expect(pagination.props('pageInfo')).toMatchObject({ totalElements: 3 })
      expect(pagination.props('pageSizeSelected')).toBe(PageSizes.TWELVE)
    })

    BddTest().then('it should render the table', () => {
      expect(wrapper.findComponent(AvTableStub).exists()).toBe(true)
    })

    BddTest().then('it should render the expected columns', () => {
      const table = wrapper.findComponent(AvTableStub)
      const columns = table.props('columns') as AvTableColumn<FeedbackStaffListItemDTO & { access?: string }>[]

      expect(columns.map(column => column.key)).toEqual([
        'student',
        'activity',
        'createdAt',
        'status',
        'iteration',
        'updatedAt',
        'access',
      ])
    })
  })

  BddTest().when('the component is mounted in mobile view', () => {
    beforeEach(async () => {
      await mountDefault({ isMobile: true })
    })

    BddTest().then('it should render one FeedbackCard per row', () => {
      expect(wrapper.findAllComponents(FeedbackCardStub)).toHaveLength(3)
    })

    BddTest().then('it should not render the table', () => {
      expect(wrapper.findComponent(AvTableStub).exists()).toBe(false)
    })
  })

  BddTest().when('the component receives no feedbacks', () => {
    beforeEach(async () => {
      await mountDefault({
        paginatedResult: {
          ...defaultPaginatedResult,
          feedbacks: computed(() => []),
          pageInfo: computed(() => undefined),
        },
      })
    })

    BddTest().then('it should pass the empty state to QuerySuspense', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)

      expect(querySuspense.props('isEmpty')).toBe(true)
      expect(querySuspense.props('emptyStateMessage')).toBe('Aucun feedback')
    })

    BddTest().then('it should not render Pagination', () => {
      expect(wrapper.findComponent(PaginationStub).exists()).toBe(false)
    })
  })

  BddTest().when('the component receives an error', () => {
    beforeEach(async () => {
      await mountDefault({
        paginatedResult: {
          ...defaultPaginatedResult,
          error: ref(mockError),
        },
      })
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)

      expect(querySuspense.props('error')).toBe(mockError)
      expect(querySuspense.props('emptyStateMessage')).toBe('Aucun feedback')
      expect(querySuspense.props('isLoading')).toBe(false)
      expect(querySuspense.props('isEmpty')).toBe(false)
    })
  })
})
