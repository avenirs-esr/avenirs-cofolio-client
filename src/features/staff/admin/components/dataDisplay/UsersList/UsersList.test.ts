import type { VueWrapper } from '@vue/test-utils'
import type { ExternalUserAffiliationOverviewDTO } from '@/api/avenir-esr'
import type {
  UsePaginatedAffiliationsParams,
  UsePaginatedAffiliationsResult,
} from '@/features/staff/admin/composables/use-paginated-affiliations/use-paginated-affiliations'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { PaginationStub } from '@/common/components/navigation/Pagination/Pagination.stub'
import { BaseApiException } from '@/common/exceptions'
import { UsersOverviewListStub } from '@/features/staff/admin/components/base/UsersOverviewList/UsersOverviewList.stub'
import UsersList from '@/features/staff/admin/components/dataDisplay/UsersList/UsersList.vue'
import { usePaginatedAffiliations } from '@/features/staff/admin/composables/use-paginated-affiliations/use-paginated-affiliations'

const mockError = new BaseApiException('error')
const mockUsers: ExternalUserAffiliationOverviewDTO[] = [{
  id: 'user-1',
  firstName: 'ALICE',
  lastName: 'DUPONT',
  email: 'alice.dupont@example.com',
  profilePictureId: undefined,
  hasConnected: true,
  categories: [],
  groups: [],
  institutions: [],
}]

const mockPageInfo = {
  page: 0,
  pageSize: 12,
  totalElements: mockUsers.length,
  totalPages: 1,
}

const mockUsersCurrentPage = ref(0)
const mockUsersPageSizeSelected = ref(12)

const defaultPaginatedResult = {
  users: computed(() => mockUsers),
  pageInfo: computed(() => mockPageInfo),
  isFetching: ref(false),
  error: ref(null),
  pageSizeSelected: computed(() => 12),
  onUpdateCurrentPage: vi.fn(),
  onUpdatePageSize: vi.fn(),
} as unknown as UsePaginatedAffiliationsResult

vi.mock('@/features/staff/admin/composables/use-paginated-affiliations/use-paginated-affiliations', () => ({
  usePaginatedAffiliations: vi.fn(),
}))

vi.mock('@/features/staff/admin/stores/users.store', () => ({
  useStaffAdminUsersStore: () => ({
    usersCurrentPage: mockUsersCurrentPage,
    usersPageSizeSelected: mockUsersPageSizeSelected,
  }),
}))

const mockUsePaginatedAffiliations = vi.mocked(usePaginatedAffiliations)

BddTest().given('a users list', () => {
  let wrapper: VueWrapper<InstanceType<typeof UsersList>>

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    Pagination: PaginationStub,
    UsersOverviewList: UsersOverviewListStub,
  }

  const mountWith = async ({
    keyword,
    categories,
    institutionIds,
    groupIds,
    paginatedResult = defaultPaginatedResult,
  }: {
    keyword?: string
    categories?: UsePaginatedAffiliationsParams['categoriesRef'] extends { value: infer T } ? T : never
    institutionIds?: string[]
    groupIds?: string[]
    paginatedResult?: UsePaginatedAffiliationsResult
  } = {}) => {
    vi.clearAllMocks()
    mockUsePaginatedAffiliations.mockReturnValue(paginatedResult)

    wrapper = mountComponent(UsersList, {
      props: {
        keyword,
        categories,
        institutionIds,
        groupIds,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getPagination = () => wrapper.findComponent(PaginationStub)
  const getUsersOverviewList = () => wrapper.findComponent(UsersOverviewListStub)

  beforeEach(async () => {
    mockUsersCurrentPage.value = 0
    mockUsersPageSizeSelected.value = 12
    await mountWith()
  })

  BddTest().when('the component is rendered', () => {
    BddTest().then('it should pass the users state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('error')).toBe(null)
      expect(getQuerySuspense().props('preserveContent')).toBe(true)
    })

    BddTest().then('it should pass the expected parameters to the paginated composable', () => {
      const params = mockUsePaginatedAffiliations.mock.calls[0][0]

      expect(params.keywordRef.value).toBeUndefined()
      expect(params.categoriesRef.value).toBeUndefined()
      expect(params.institutionIdsRef.value).toBeUndefined()
      expect(params.groupIdsRef.value).toBeUndefined()
      expect(params.pageRef.value).toBe(0)
      expect(params.pageSizeRef.value).toBe(12)
    })

    BddTest().then('it should render the pagination', () => {
      expect(getPagination().exists()).toBe(true)
      expect(getPagination().props('pageInfo')).toBe(mockPageInfo)
      expect(getPagination().props('pageSizeSelected')).toBe(12)
      expect(getPagination().props('onUpdateCurrentPage')).toBe(defaultPaginatedResult.onUpdateCurrentPage)
      expect(getPagination().props('onUpdatePageSize')).toBe(defaultPaginatedResult.onUpdatePageSize)
    })

    BddTest().then('it should pass the mapped user rows to UsersOverviewList', () => {
      expect(getUsersOverviewList().props('rows')).toStrictEqual(
        mockUsers.map(user => ({
          id: user.id,
          institutions: user.institutions,
          user: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePictureId: user.profilePictureId,
          },
        })),
      )
    })

    BddTest().then('it should pass the user and actions columns to UsersOverviewList', () => {
      expect(getUsersOverviewList().props('columns')).toStrictEqual([
        { key: 'user', label: 'Utilisateur(rice)', width: '95%' },
        { key: 'actions', label: 'Actions', width: '5%' },
      ])
    })

    BddTest().then('it should not render the empty state when users exist', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })
  })

  BddTest().when('the component receives search filters', () => {
    const categories = ['STUDENT'] as unknown as NonNullable<
      UsePaginatedAffiliationsParams['categoriesRef'] extends { value: infer T } ? T : never
    >
    const institutionIds = ['institution-1']
    const groupIds = ['group-1']

    beforeEach(async () => {
      await mountWith({
        keyword: 'alice',
        categories,
        institutionIds,
        groupIds,
      })
    })

    BddTest().then('it should pass the filters to the paginated composable', () => {
      const params = mockUsePaginatedAffiliations.mock.calls[0][0]

      expect(params.keywordRef.value).toBe('alice')
      expect(params.categoriesRef.value).toStrictEqual(categories)
      expect(params.institutionIdsRef.value).toStrictEqual(institutionIds)
      expect(params.groupIdsRef.value).toStrictEqual(groupIds)
    })
  })

  BddTest().when('the affiliations query returns no users', () => {
    const emptyResult = {
      ...defaultPaginatedResult,
      users: computed(() => []),
      pageInfo: computed(() => undefined),
    } as unknown as UsePaginatedAffiliationsResult

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

    BddTest().then('it should not render UsersOverviewList', () => {
      expect(getUsersOverviewList().exists()).toBe(false)
    })
  })

  BddTest().when('the affiliations query returns an error', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          error: ref(mockError),
        } as UsePaginatedAffiliationsResult,
      })
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBe(mockError)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })
  })

  BddTest().when('the affiliations query is fetching', () => {
    beforeEach(async () => {
      await mountWith({
        paginatedResult: {
          ...defaultPaginatedResult,
          isFetching: ref(true),
        } as UsePaginatedAffiliationsResult,
      })
    })

    BddTest().then('it should pass the loading state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(true)
    })
  })
})
