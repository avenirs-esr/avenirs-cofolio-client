import type { VueWrapper } from '@vue/test-utils'
import type { UsePaginatedStaffAdminGroupsParams, UsePaginatedStaffAdminGroupsResult } from '@/features/staff/admin/composables/use-paginated-staff-admin-groups/use-paginated-staff-admin-groups'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { BaseApiException } from '@avenirs-esr/shared'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { generateGroupOverviewDTOs, mockGroupOverview, mockGroupOverviewWithParent } from '@/__mocks__/fixtures/staffs/groups.fixtures'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { PaginationStub } from '@/common/components/navigation/Pagination/Pagination.stub'
import { GroupOverviewListStub } from '@/features/staff/admin/components/base/GroupOverviewList/GroupOverviewList.stub'
import GroupsList from '@/features/staff/admin/components/dataDisplay/GroupsList/GroupsList.vue'
import { usePaginatedStaffAdminGroups } from '@/features/staff/admin/composables/use-paginated-staff-admin-groups/use-paginated-staff-admin-groups'

const mockError = new BaseApiException('error')
const mockGroups = [mockGroupOverview, mockGroupOverviewWithParent]

const mockPageInfo = {
  page: 0,
  pageSize: 12,
  totalElements: mockGroups.length,
  totalPages: 1,
}

const mockGroupsCurrentPage = ref(0)
const mockGroupsPageSizeSelected = ref(12)

const defaultPaginatedResult = {
  groups: computed(() => mockGroups),
  pageInfo: computed(() => mockPageInfo),
  isFetching: ref(false),
  error: ref(null),
  pageSizeSelected: computed(() => 12),
  onUpdateCurrentPage: vi.fn(),
  onUpdatePageSize: vi.fn(),
} as unknown as UsePaginatedStaffAdminGroupsResult

vi.mock('@/features/staff/admin/composables/use-paginated-staff-admin-groups/use-paginated-staff-admin-groups', () => ({
  usePaginatedStaffAdminGroups: vi.fn(),
}))

vi.mock('@/features/staff/admin/stores/groups.store', () => ({
  useStaffAdminGroupsStore: () => ({
    groupsCurrentPage: mockGroupsCurrentPage,
    groupsPageSizeSelected: mockGroupsPageSizeSelected,
  }),
}))

const mockUsePaginatedStaffAdminGroups = vi.mocked(usePaginatedStaffAdminGroups)

BddTest().given('a groups list', () => {
  let wrapper: VueWrapper<InstanceType<typeof GroupsList>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    Pagination: PaginationStub,
    GroupOverviewList: GroupOverviewListStub,
  }

  const mountWith = async ({
    keyword,
    types,
    groupId,
    paginatedResult = defaultPaginatedResult,
  }: {
    keyword?: string
    types?: UsePaginatedStaffAdminGroupsParams['typesRef'] extends { value: infer T } ? T : never
    groupId?: string
    paginatedResult?: UsePaginatedStaffAdminGroupsResult
  } = {}) => {
    vi.clearAllMocks()

    mockUsePaginatedStaffAdminGroups.mockReturnValue(paginatedResult)

    wrapper = mountComponent(GroupsList, {
      props: {
        keyword,
        types,
        groupId,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getPagination = () => wrapper.findComponent(PaginationStub)
  const getGroupOverviewList = () => wrapper.findComponent(GroupOverviewListStub)

  beforeEach(async () => {
    mockGroupsCurrentPage.value = 0
    mockGroupsPageSizeSelected.value = 12
    await mountWith()
  })

  BddTest().when('the component is rendered in groups mode', () => {
    BddTest().then('it should pass the groups state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('error')).toBe(null)
      expect(getQuerySuspense().props('preserveContent')).toBe(true)
    })

    BddTest().then('it should pass the expected parameters to the paginated composable', () => {
      const params = mockUsePaginatedStaffAdminGroups.mock.calls[0][0]

      expect(params.enabledRef.value).toBe(true)
      expect(params.keywordRef.value).toBeUndefined()
      expect(params.typesRef.value).toBeUndefined()
      expect(params.currentPageRef.value).toBe(0)
      expect(params.pageSizeRef.value).toBe(12)
    })

    BddTest().then('it should render the pagination', () => {
      expect(getPagination().exists()).toBe(true)
      expect(getPagination().props('pageInfo')).toBe(mockPageInfo)
      expect(getPagination().props('pageSizeSelected')).toBe(12)
      expect(getPagination().props('onUpdateCurrentPage')).toBe(defaultPaginatedResult.onUpdateCurrentPage)
      expect(getPagination().props('onUpdatePageSize')).toBe(defaultPaginatedResult.onUpdatePageSize)
    })

    BddTest().then('it should pass the groups rows to GroupOverviewList', () => {
      expect(getGroupOverviewList().props('rows')).toStrictEqual(
        mockGroups.map(group => ({
          ...group,
          parentName: group.parent?.name ?? '',
        })),
      )
    })

    BddTest().then('it should pass the full group columns to GroupOverviewList', () => {
      expect(getGroupOverviewList().props('columns')).toStrictEqual([
        { key: 'name', label: 'Groupe', width: '35%' },
        { key: 'type', label: 'Type', width: '25%' },
        { key: 'parentName', label: 'Rattaché à', width: '30%' },
        { key: 'usersCount', label: 'Nombre de membres', width: '10%' },
      ])
    })

    BddTest().then('it should disable subgroup mode', () => {
      expect(getGroupOverviewList().props('subGroupMode')).toBe(false)
    })

    BddTest().then('it should not get subgroups', async () => {
      await vi.waitFor(() => {
        const groupOverviewList = getGroupOverviewList()
        expect(groupOverviewList.attributes('data-testid')).not.toBe('sub-groups-list')
      })
    })

    BddTest().then('it should not render the empty state when groups exist', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })
  })

  BddTest().when('the component receives a keyword and group types', () => {
    const types = ['PROGRAM', 'STUDENT_GROUP'] as UsePaginatedStaffAdminGroupsParams['typesRef'] extends { value: infer T } ? T : never

    beforeEach(async () => {
      await mountWith({ keyword: 'mathématiques', types })
    })

    BddTest().then('it should pass the keyword and types to the paginated composable', () => {
      const params = mockUsePaginatedStaffAdminGroups.mock.calls[0][0]

      expect(params.keywordRef.value).toBe('mathématiques')
      expect(params.typesRef.value).toStrictEqual(types)
    })
  })

  BddTest().when('the component is rendered in subgroup mode', () => {
    beforeEach(async () => {
      await mountWith({ groupId: 'group-123' })
    })

    BddTest().then('it should request subgroups', async () => {
      await vi.waitFor(() => {
        const groupOverviewList = getGroupOverviewList()
        expect(groupOverviewList.attributes('data-testid')).toBe('sub-groups-list')
      })
    })

    BddTest().then('it should disable the paginated groups query', () => {
      const params = mockUsePaginatedStaffAdminGroups.mock.calls[0][0]

      expect(params.enabledRef.value).toBe(false)
    })

    BddTest().then('it should not render pagination', () => {
      expect(getPagination().exists()).toBe(false)
    })

    BddTest().then('it should pass the subgroups to GroupOverviewList', () => {
      expect(getGroupOverviewList().props('rows')).toEqual(generateGroupOverviewDTOs(3))
    })

    BddTest().then('it should pass the subgroup columns to GroupOverviewList', () => {
      expect(getGroupOverviewList().props('columns')).toStrictEqual([
        { key: 'name', label: 'Groupe', width: '80%' },
        { key: 'type', label: 'Type', width: '20%' },
      ])
    })

    BddTest().then('it should enable subgroup mode', () => {
      expect(getGroupOverviewList().props('subGroupMode')).toBe(true)
    })

    BddTest().then('it should set the subgroups custom empty state message', () => {
      expect(getQuerySuspense().props('emptyStateMessage')).toBe('Aucun sous-groupe')
    })
  })

  BddTest().when('the groups query returns no groups', () => {
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

    BddTest().then('it should not render pagination when page info is missing', () => {
      expect(getPagination().exists()).toBe(false)
    })

    BddTest().then('it should not render GroupOverviewList', () => {
      expect(getGroupOverviewList().exists()).toBe(false)
    })
  })

  BddTest().when('the subgroups query returns no subgroups', () => {
    beforeEach(async () => {
      await mountWith({ groupId: 'EMPTY_ID' })
    })

    BddTest().then('it should pass the empty state with the subgroups empty message', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(true)
      expect(getQuerySuspense().props('emptyStateMessage')).toBe('Aucun sous-groupe')
    })
  })

  BddTest().when('the groups query returns an error', () => {
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
  })

  BddTest().when('the subgroups query returns an error', () => {
    beforeEach(async () => {
      await mountWith({
        groupId: 'INVALID_ID',
      })
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBeTruthy()
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('isEmpty')).toBe(true)
    })
  })

  BddTest().when('the groups query is fetching', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          isFetching: ref(true),
        } as UsePaginatedStaffAdminGroupsResult,
      })
    })

    BddTest().then('it should pass the loading state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(true)
    })
  })

  BddTest().when('the subgroups query is fetching', () => {
    beforeEach(async () => {
      await mountWith({
        groupId: 'LOADING_ID',
      })
    })

    BddTest().then('it should pass the loading state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(true)
    })
  })
})
