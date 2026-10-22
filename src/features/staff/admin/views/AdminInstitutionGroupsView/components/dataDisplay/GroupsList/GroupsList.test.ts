import type { VueWrapper } from '@vue/test-utils'
import type { UsePaginatedStaffAdminGroupsResult } from '@/features/staff/admin/composables/use-paginated-staff-admin-groups/use-paginated-staff-admin-groups'
import { AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockGroupOverview, mockGroupOverviewWithParent } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { PaginationStub } from '@/common/components/navigation/Pagination/Pagination.stub'
import { BaseApiException } from '@/common/exceptions'
import { GroupTypeBadgeStub } from '@/features/staff/admin/components/badges/GroupTypeBadge/GroupTypeBadge.stub'
import { GroupNameStub } from '@/features/staff/admin/components/base/GroupName/GroupName.stub'
import { GroupParentNameStub } from '@/features/staff/admin/components/base/GroupParentName/GroupParentName.stub'
import { GroupCardStub } from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/cards/GroupCard/GroupCard.stub'
import GroupsList from '@/features/staff/admin/views/AdminInstitutionGroupsView/components/dataDisplay/GroupsList/GroupsList.vue'

const mockIsBelowLg = ref(false)
const mockError = new BaseApiException('error')
const mockGroups = [mockGroupOverview, mockGroupOverviewWithParent]

const mockPageInfo = {
  page: 0,
  pageSize: 12,
  totalElements: mockGroups.length,
  totalPages: 1,
}

const defaultPaginatedResult = {
  groups: computed(() => mockGroups),
  pageInfo: computed(() => mockPageInfo),
  isFetching: ref(false),
  error: ref(null),
  pageSizeSelected: computed(() => 12),
  onUpdateCurrentPage: vi.fn(),
  onUpdatePageSize: vi.fn(),
} as unknown as UsePaginatedStaffAdminGroupsResult

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({ isBelowLg: mockIsBelowLg }),
  }
})

vi.mock('@/features/staff/admin/composables/use-paginated-staff-admin-groups/use-paginated-staff-admin-groups', () => ({
  usePaginatedStaffAdminGroups: vi.fn(),
}))

const { usePaginatedStaffAdminGroups: mockedUsePaginatedStaffAdminGroups } = await import('@/features/staff/admin/composables/use-paginated-staff-admin-groups/use-paginated-staff-admin-groups')
const mockUsePaginatedStaffAdminGroups = vi.mocked(mockedUsePaginatedStaffAdminGroups)

BddTest().given('a groups list', () => {
  let wrapper: VueWrapper<InstanceType<typeof GroupsList>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    Pagination: PaginationStub,
    AvTable: AvTableStub,
    GroupName: GroupNameStub,
    GroupParentName: GroupParentNameStub,
    GroupTypeBadge: GroupTypeBadgeStub,
    GroupCard: GroupCardStub,
  }

  const mountWith = async ({
    isBelowLg = false,
    paginatedResult = defaultPaginatedResult,
  }: {
    isBelowLg?: boolean
    paginatedResult?: UsePaginatedStaffAdminGroupsResult
  } = {}) => {
    vi.clearAllMocks()
    mockIsBelowLg.value = isBelowLg
    mockUsePaginatedStaffAdminGroups.mockReturnValue(paginatedResult)

    wrapper = mountComponent(GroupsList, {
      global: { stubs },
    })

    await flushPromises()
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getPagination = () => wrapper.findComponent(PaginationStub)
  const getTable = () => wrapper.findComponent(AvTableStub)
  const getCardsContainer = () => wrapper.find('[data-testid="groups-list-cards"]')
  const getGroupCards = () => wrapper.findAllComponents(GroupCardStub)

  beforeEach(async () => {
    await mountWith()
  })

  BddTest().when('the component is rendered on a large screen', () => {
    BddTest().then('it should render the component', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should pass the groups to QuerySuspense', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('error')).toBe(null)
    })

    BddTest().then('it should render the pagination', () => {
      expect(getPagination().exists()).toBe(true)
      expect(getPagination().props('pageInfo')).toBe(mockPageInfo)
      expect(getPagination().props('pageSizeSelected')).toBe(12)
      expect(getPagination().props('onUpdateCurrentPage')).toBe(defaultPaginatedResult.onUpdateCurrentPage)
      expect(getPagination().props('onUpdatePageSize')).toBe(defaultPaginatedResult.onUpdatePageSize)
    })

    BddTest().then('it should display the table', () => {
      expect(getTable().exists()).toBe(true)
    })

    BddTest().then('it should pass the groups to the table', () => {
      expect(getTable().props('rows')).toStrictEqual(mockGroups)
    })

    BddTest().then('it should use the group id as row key', () => {
      expect(getTable().props('rowKey')).toBe('id')
    })

    BddTest().then('it should define the expected columns', () => {
      expect(getTable().props('columns')).toStrictEqual([
        { key: 'name', label: 'Groupe', width: '30%' },
        { key: 'type', label: 'Type', width: '20%' },
        { key: 'parentName', label: 'Rattaché à', width: '30%' },
        { key: 'usersCount', label: 'Nombre de membres', width: '20%' },
      ])
    })

    BddTest().then('it should render each group name', () => {
      expect(wrapper.findAll('[data-testid="group-name"]')).toHaveLength(mockGroups.length)
    })

    BddTest().then('it should render each group type badge', () => {
      expect(wrapper.findAll('[data-testid="group-type-badge"]')).toHaveLength(mockGroups.length)
    })

    BddTest().then('it should render each group parent name', () => {
      expect(wrapper.findAll('[data-testid="group-parent-name-stub"]')).toHaveLength(mockGroups.length)
    })

    BddTest().then('it should display the users count for each group', () => {
      const cells = wrapper.findAll('[data-testid="group-list-users-count-cell"]')

      expect(cells).toHaveLength(mockGroups.length)
      expect(cells.map(cell => cell.text())).toStrictEqual(
        mockGroups.map(group => String(group.usersCount)),
      )
    })

    BddTest().then('it should pass the group to the name component', () => {
      expect(wrapper.findComponent(GroupNameStub).props('group')).toStrictEqual(mockGroups[0])
    })

    BddTest().then('it should pass the group type to the badge component', () => {
      expect(wrapper.findComponent(GroupTypeBadgeStub).props('type')).toBe(mockGroups[0].type)
    })

    BddTest().then('it should pass the group to the parent name component', () => {
      expect(wrapper.findComponent(GroupParentNameStub).props('group')).toStrictEqual(mockGroups[0])
    })

    BddTest().then('it should not display the cards container', () => {
      expect(getCardsContainer().exists()).toBe(false)
    })
  })

  BddTest().when('the component is rendered below the large breakpoint', () => {
    beforeEach(async () => {
      await mountWith({ isBelowLg: true })
    })

    BddTest().then('it should display the cards container', () => {
      expect(getCardsContainer().exists()).toBe(true)
    })

    BddTest().then('it should not display the table', () => {
      expect(getTable().exists()).toBe(false)
    })

    BddTest().then('it should render one card per group', () => {
      expect(getGroupCards()).toHaveLength(mockGroups.length)
    })

    BddTest().then('it should pass each group to its card', () => {
      expect(getGroupCards().map(card => card.props('group'))).toStrictEqual(mockGroups)
    })
  })

  BddTest().when('the component receives no groups', () => {
    const emptyResult = {
      ...defaultPaginatedResult,
      groups: computed(() => []),
      pageInfo: computed(() => undefined),
    } as unknown as UsePaginatedStaffAdminGroupsResult

    beforeEach(async () => {
      await mountWith({ paginatedResult: emptyResult })
    })

    BddTest().then('it should pass the empty state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(true)
      expect(getQuerySuspense().props('emptyStateMessage')).toBe('Aucun résultat')
    })

    BddTest().then('it should not render Pagination when page info is missing', () => {
      expect(getPagination().exists()).toBe(false)
    })

    BddTest().then('it should display the empty state', () => {
      expect(wrapper.find('[data-testid="query-suspense-empty"]').exists()).toBe(true)
    })
  })

  BddTest().when('the component receives an error', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          error: ref(mockError),
        } as UsePaginatedStaffAdminGroupsResult,
      })
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBe(mockError)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })

    BddTest().then('it should display the error state', () => {
      expect(wrapper.find('[data-testid="query-suspense-error"]').exists()).toBe(true)
    })
  })

  BddTest().when('the groups are being fetched', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          isFetching: ref(true),
        } as UsePaginatedStaffAdminGroupsResult,
      })
    })

    BddTest().then('it should pass the fetching state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(true)
    })

    BddTest().then('it should display the loading state', () => {
      expect(wrapper.find('[data-testid="query-suspense-loading"]').exists()).toBe(true)
    })
  })
})
