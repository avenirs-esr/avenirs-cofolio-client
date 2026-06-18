import type { UsePaginatedStaffActivitesParams, UsePaginatedStaffActivitesResult } from '@/features/staff/activities/composables/use-paginated-staff-activites/use-paginated-staff-activites'
import type { ActivityTableRow } from '@/features/staff/activities/views/ActivitiesView/ActivitiesView.types'
import { createMockedPagedResponseActivityStaffOverviewDTO } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { EActivityStatus } from '@/api/avenir-esr'
import { ActivityStatusBadgeStub } from '@/common/activities/badges/ActivityStatusBadge/ActivityStatusBadge.stub'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { PaginationStub } from '@/common/components/Pagination/Pagination.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { BaseApiException } from '@/common/exceptions'
import ActivitiesTab from '@/features/staff/activities/views/ActivitiesView/components/ActivitiesTab/ActivitiesTab.vue'
import { ActivityCardStub } from '@/features/staff/activities/views/ActivitiesView/components/ActivityCard/ActivityCard.stub'
import { ActivityTableTitleStub } from '@/features/staff/activities/views/ActivitiesView/components/ActivityTableTitle/ActivityTableTitle.stub'
import { MoreActionsDropdownStub } from '@/features/staff/activities/views/ActivitiesView/components/MoreActionsDropdown/MoreActionsDropdown.stub'
import { type AvTableColumn, PageSizes } from '@avenirs-esr/avenirs-dsav'
import { AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockError = new BaseApiException('error')

const mockFormatLastModified = vi.fn((value: string) => `formatted-${value}`)

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useDateUtils: () => ({
      formatLastModified: mockFormatLastModified,
    }),
  }
})

const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({ isMobile: mockIsMobile })
  }
})

const page = createMockedPagedResponseActivityStaffOverviewDTO(PageSizes.TWELVE, 6, 0)
const defaultPaginatedResult: UsePaginatedStaffActivitesResult = {
  activities: computed(() => page.data),
  pageInfo: computed(() => page.page),
  isFetching: ref(false),
  error: ref(null),
  pageSizeSelected: ref(PageSizes.TWELVE),
  onUpdateCurrentPage: vi.fn(),
  onUpdatePageSize: vi.fn(),
}

const mockUsePaginatedStaffActivitesParams: UsePaginatedStaffActivitesParams = {
  currentPageRef: ref(0),
  pageSizeRef: ref(PageSizes.TWELVE),
  fetchFn: vi.fn(),
}

vi.mock('@/features/staff/activities/composables/use-paginated-staff-activites/use-paginated-staff-activites', () => ({
  usePaginatedStaffActivites: vi.fn(),
}))

const { usePaginatedStaffActivites: mockedUsePaginatedStaffActivites } = await import('@/features/staff/activities/composables/use-paginated-staff-activites/use-paginated-staff-activites')
const mockUsePaginatedStaffActivites = vi.mocked(mockedUsePaginatedStaffActivites)

BddTest().given('a ActivitiesTab component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivitiesTab>>

  const stubs = {
    ActivityCard: ActivityCardStub,
    ActivityStatusBadge: ActivityStatusBadgeStub,
    ActivityTableTitle: ActivityTableTitleStub,
    AvTable: AvTableStub,
    ConfirmationModal: ConfirmationModalStub,
    MoreActionsDropdown: MoreActionsDropdownStub,
    Pagination: PaginationStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const mountDefault = async ({
    props = {},
    isMobile = false,
    paginatedResult = defaultPaginatedResult,
  }: {
    props?: Record<string, unknown>
    isMobile?: boolean
    paginatedResult?: typeof defaultPaginatedResult
  } = {}) => {
    vi.clearAllMocks()
    mockIsMobile.value = isMobile
    mockUsePaginatedStaffActivites.mockReturnValue(paginatedResult)

    wrapper = mountComponent(ActivitiesTab, {
      props: {
        title: 'Mes activités',
        emptyStateMessage: 'Aucune activité',
        withStatus: false,
        usePaginatedStaffActivitiesParams: mockUsePaginatedStaffActivitesParams,
        ...props,
      },
      global: { stubs }
    })

    await flushPromises()
  }

  function confirmationModal () {
    return wrapper.findComponent(ConfirmationModalStub)
  }

  function moreActionsDropdowns () {
    return wrapper.findAllComponents(MoreActionsDropdownStub)
  }

  beforeEach(async () => {
    await mountDefault()
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should emit updateActivitiesCount with the correct count', async () => {
      expect(wrapper.emitted('updateActivitiesCount')).toBeTruthy()
      expect(wrapper.emitted('updateActivitiesCount')![0]).toEqual([6])
    })

    BddTest().then('it should emit updateActivitiesCount with 0 when pageInfo is undefined', async () => {
      await mountDefault({
        paginatedResult: {
          ...defaultPaginatedResult,
          activities: computed(() => []),
          pageInfo: computed(() => undefined),
        }
      })
      expect(wrapper.emitted('updateActivitiesCount')).toBeTruthy()
      expect(wrapper.emitted('updateActivitiesCount')![0]).toEqual([0])
    })
  })

  BddTest().when('the component is mounted in desktop view', () => {
    BddTest().then('it should display the title', () => {
      expect(wrapper.find('[data-testid="activities-tab-title"]').text()).toBe('Mes activités')
    })

    BddTest().then('it should render the pagination', () => {
      const pagination = wrapper.findComponent(PaginationStub)

      expect(pagination.exists()).toBe(true)
      expect(pagination.props('pageInfo')).toMatchObject({ totalElements: 6 })
      expect(pagination.props('pageSizeSelected')).toBe(PageSizes.TWELVE)
    })

    BddTest().then('it should render the table', () => {
      expect(wrapper.findComponent(AvTableStub).exists()).toBe(true)
      expect(wrapper.findAllComponents(ActivityTableTitleStub)).toHaveLength(6)
      expect(mockFormatLastModified).toHaveBeenCalledTimes(6)
    })

    BddTest().then('it should not render the status column when withStatus is false', () => {
      const table = wrapper.findComponent(AvTableStub)
      const columns = table.props('columns') as AvTableColumn<ActivityTableRow>[]

      expect(columns.map(column => column.key)).toEqual(['title', 'updatedAt', 'owner'])
    })
  })

  BddTest().when('the component is mounted in desktop view with withStatus enabled', () => {
    beforeEach(async () => {
      await mountDefault({ props: { withStatus: true } })
    })

    BddTest().then('it should add the status column', () => {
      const table = wrapper.findComponent(AvTableStub)
      const columns = table.props('columns') as AvTableColumn<ActivityTableRow>[]

      expect(columns.map(column => column.key)).toEqual(['title', 'updatedAt', 'owner', 'status'])
    })

    BddTest().then('it should render one status badge per activity', () => {
      expect(wrapper.findAll('[data-testid="activity-status-badge"]')).toHaveLength(6)
    })
  })

  BddTest().when('the component is mounted with withActionsColumn enabled', () => {
    beforeEach(async () => {
      await mountDefault({ props: { withActionsColumn: true } })
    })

    BddTest().then('it should add the actions column', () => {
      const table = wrapper.findComponent(AvTableStub)
      const columns = table.props('columns') as AvTableColumn<ActivityTableRow>[]

      expect(columns.map(column => column.key)).toContain('actions')
    })

    BddTest().then('it should render one MoreActionsDropdown per row', () => {
      expect(moreActionsDropdowns()).toHaveLength(6)
    })

    BddTest().then('it should pass the correct activityStatus to each MoreActionsDropdown', () => {
      const dropdowns = moreActionsDropdowns()

      expect(dropdowns[0].props('activityStatus')).toBe(EActivityStatus.PUBLISHED)
      expect(dropdowns[1].props('activityStatus')).toBe(EActivityStatus.DRAFT)
    })

    BddTest().then('the confirmation modal should not be visible initially', () => {
      expect(confirmationModal().props('show')).toBe(false)
    })

    BddTest().and('deleteSelected is emitted from a MoreActionsDropdown', () => {
      beforeEach(() => {
        moreActionsDropdowns()[0].vm.$emit('deleteSelected')
      })

      BddTest().then('it should show the confirmation modal', () => {
        expect(confirmationModal().props('show')).toBe(true)
      })

      BddTest().then('it should display the correct confirmation title', () => {
        expect(confirmationModal().props('title')).toBe('Êtes-vous certain(e) de vouloir supprimer cette activité ?')
      })

      BddTest().and('the user confirms', () => {
        beforeEach(async () => {
          await confirmationModal().vm.$emit('confirm')
        })

        BddTest().then('it should emit deleteDraftActivity with the activity id', () => {
          expect(wrapper.emitted('deleteDraftActivity')).toHaveLength(1)
          expect(wrapper.emitted('deleteDraftActivity')![0]).toEqual(['staff-activity-1'])
        })

        BddTest().then('it should hide the confirmation modal', () => {
          expect(confirmationModal().props('show')).toBe(false)
        })
      })

      BddTest().and('the user cancels', () => {
        beforeEach(async () => {
          confirmationModal().vm.$emit('close')
        })

        BddTest().then('it should not emit deleteDraftActivity', () => {
          expect(wrapper.emitted('deleteDraftActivity')).toBeUndefined()
        })

        BddTest().then('it should hide the confirmation modal', () => {
          expect(confirmationModal().props('show')).toBe(false)
        })
      })
    })
  })

  BddTest().when('the component is mounted in mobile view', () => {
    beforeEach(async () => {
      await mountDefault({ isMobile: true })
    })

    BddTest().then('it should render one ActivityCard per row', () => {
      expect(wrapper.findAllComponents(ActivityCardStub)).toHaveLength(6)
    })

    BddTest().then('it should not render the table', () => {
      expect(wrapper.findComponent(AvTableStub).exists()).toBe(false)
    })

    BddTest().then('it should not pass withStatus to ActivityCards by default', () => {
      const cards = wrapper.findAllComponents(ActivityCardStub)
      cards.forEach((card) => {
        expect(card.props('withStatus')).toBe(false)
      })
    })
  })

  BddTest().when('the component is mounted in mobile view with withStatus enabled', () => {
    beforeEach(async () => {
      await mountDefault({ isMobile: true, props: { withStatus: true } })
    })

    BddTest().then('it should render one ActivityCard per row', () => {
      expect(wrapper.findAllComponents(ActivityCardStub)).toHaveLength(6)
    })

    BddTest().then('it should not render the table', () => {
      expect(wrapper.findComponent(AvTableStub).exists()).toBe(false)
    })

    BddTest().then('it should pass withStatus to each ActivityCard', () => {
      const cards = wrapper.findAllComponents(ActivityCardStub)
      cards.forEach((card) => {
        expect(card.props('withStatus')).toBe(true)
      })
    })
  })

  BddTest().when('the component receives no activities', () => {
    beforeEach(async () => {
      await mountDefault({
        paginatedResult: {
          ...defaultPaginatedResult,
          activities: computed(() => []),
          pageInfo: computed(() => undefined),
        }
      })
    })

    BddTest().then('it should pass the empty state to QuerySuspense', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)

      expect(querySuspense.props('isEmpty')).toBe(true)
      expect(querySuspense.props('emptyStateMessage')).toBe('Aucune activité')
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
        }
      })
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      const querySuspense = wrapper.findComponent(QuerySuspenseStub)

      expect(querySuspense.props('error')).toBe(mockError)
      expect(querySuspense.props('emptyStateMessage')).toBe('Aucune activité')
      expect(querySuspense.props('isLoading')).toBe(false)
      expect(querySuspense.props('isEmpty')).toBe(false)
    })
  })
})
