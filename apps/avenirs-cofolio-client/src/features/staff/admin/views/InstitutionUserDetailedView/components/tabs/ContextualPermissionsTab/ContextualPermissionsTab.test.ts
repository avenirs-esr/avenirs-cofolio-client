import type { VueWrapper } from '@vue/test-utils'
import type { ContextualAuthorizationDTO, ExternalUserDetailDTO } from '@/api/avenir-esr'
import { AvMessageStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { EAuthorizationEntityType } from '@/api/avenir-esr'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { PaginationStub } from '@/common/components/navigation/Pagination/Pagination.stub'
import { UserContextualAuthorizationsTableStub } from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserContextualAuthorizationsTable/UserContextualAuthorizationsTable.stub'
import { AuthorizationEntityTypeSelectStub } from '@/features/staff/admin/views/InstitutionUserDetailedView/components/selects/AuthorizationEntityTypeSelect/AuthorizationEntityTypeSelect.stub'
import ContextualPermissionsTab from '@/features/staff/admin/views/InstitutionUserDetailedView/components/tabs/ContextualPermissionsTab/ContextualPermissionsTab.vue'
import { usePaginatedUserContextualAuthorizations } from '@/features/staff/admin/views/InstitutionUserDetailedView/composables/use-paginated-user-contextual-authorizations/use-paginated-user-contextual-authorizations'

const mockIsFetching = ref(false)
const mockError = ref<Error | null>(null)
const mockAuthorizations = ref<ContextualAuthorizationDTO[]>([
  {
    entityId: 'activity-1',
    entityName: 'Activité 1',
    entityType: EAuthorizationEntityType.ACTIVITY,
    authorizations: ['LEADER'],
  },
] as ContextualAuthorizationDTO[])
const mockPageInfo = ref({})
const mockPageSizeSelected = ref(12)
const mockOnUpdateCurrentPage = vi.fn()
const mockOnUpdatePageSize = vi.fn()

vi.mock('@/features/staff/admin/views/InstitutionUserDetailedView/composables/use-paginated-user-contextual-authorizations/use-paginated-user-contextual-authorizations', () => ({
  usePaginatedUserContextualAuthorizations: vi.fn(() => ({
    authorizations: mockAuthorizations,
    pageInfo: mockPageInfo,
    isFetching: mockIsFetching,
    error: mockError,
    pageSizeSelected: mockPageSizeSelected,
    onUpdateCurrentPage: mockOnUpdateCurrentPage,
    onUpdatePageSize: mockOnUpdatePageSize,
  })),
}))

BddTest().given('a contextual permissions tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof ContextualPermissionsTab>>

  const user = mockExternalUserDetail

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    Pagination: PaginationStub,
    UserContextualAuthorizationsTable: UserContextualAuthorizationsTableStub,
    AuthorizationEntityTypeSelect: AuthorizationEntityTypeSelectStub,
    AvMessage: AvMessageStub,
  }

  const mountWith = async (options: {
    user?: ExternalUserDetailDTO
  } = {}) => {
    wrapper = mountComponent(ContextualPermissionsTab, {
      props: {
        user: options.user ?? user,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getPagination = () => wrapper.findComponent(PaginationStub)
  const getAuthorizationsTable = () => wrapper.findComponent(UserContextualAuthorizationsTableStub)
  const getInfoMessage = () => wrapper.findComponent(AvMessageStub)
  const getEntityTypeSelect = () => wrapper.findComponent(AuthorizationEntityTypeSelectStub)

  const getQueryParams = () => {
    const [params] = vi.mocked(usePaginatedUserContextualAuthorizations).mock.calls[0]
    return params
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockIsFetching.value = false
    mockError.value = null
    mockAuthorizations.value = [
      {
        entityId: 'activity-1',
        entityName: 'Activité 1',
        entityType: EAuthorizationEntityType.ACTIVITY,
        authorizations: ['LEADER'],
      },
    ] as ContextualAuthorizationDTO[]
    mockPageInfo.value = {}
    mockPageSizeSelected.value = 12
  })

  BddTest().when('the tab is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the entity type select with no selected type', () => {
      expect(getEntityTypeSelect().exists()).toBe(true)
      expect(getEntityTypeSelect().props('modelValue')).toBeUndefined()
    })

    BddTest().then('it should pass the current user to the entity type select', () => {
      expect(getEntityTypeSelect().props('user')).toEqual(user)
    })

    BddTest().then('it should configure the query for the current user', () => {
      expect(getQueryParams()).toEqual(expect.objectContaining({
        userIdRef: expect.objectContaining({ value: user.id }),
        entityTypeRef: expect.objectContaining({ value: undefined }),
      }))
    })

    BddTest().then('it should disable the query when no entity type is selected', () => {
      expect(getQueryParams().enabledRef.value).toBe(false)
    })

    BddTest().then('it should render QuerySuspense', () => {
      expect(getQuerySuspense().exists()).toBe(true)
    })

    BddTest().then('it should pass the loading state and error to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('error')).toBeNull()
    })

    BddTest().then('it should pass the empty state message to QuerySuspense', () => {
      expect(getQuerySuspense().props('emptyStateMessage')).toBe('Aucune permission')
    })

    BddTest().then('it should indicate whether the authorizations are empty', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })

    BddTest().then('it should preserve the content while loading', () => {
      expect(getQuerySuspense().props('preserveContent')).toBe(true)
    })

    BddTest().then('it should render pagination when page information is available', () => {
      expect(getPagination().exists()).toBe(true)
      expect(getPagination().props('pageInfo')).toBe(mockPageInfo.value)
      expect(getPagination().props('pageSizeSelected')).toBe(12)
      expect(getPagination().props('onUpdateCurrentPage')).toBe(mockOnUpdateCurrentPage)
      expect(getPagination().props('onUpdatePageSize')).toBe(mockOnUpdatePageSize)
    })

    BddTest().then('it should display the contextual information message', () => {
      expect(getInfoMessage().exists()).toBe(true)
      expect(getInfoMessage().props('type')).toBe('info')
    })

    BddTest().then('it should pass the authorizations returned by the composable to the table', () => {
      expect(getAuthorizationsTable().exists()).toBe(true)
      expect(getAuthorizationsTable().props('contextualAuthorizations')).toEqual(mockAuthorizations.value)
    })
  })

  BddTest().when('the user selects an entity type', () => {
    beforeEach(async () => {
      await mountWith()

      await getEntityTypeSelect().vm.$emit(
        'update:modelValue',
        EAuthorizationEntityType.ACTIVITY,
      )

      await nextTick()
    })

    BddTest().then('it should update the selected entity type', () => {
      expect(getEntityTypeSelect().props('modelValue')).toBe(EAuthorizationEntityType.ACTIVITY)
    })

    BddTest().then('it should enable the query', () => {
      expect(getQueryParams().enabledRef.value).toBe(true)
    })

    BddTest().then('it should pass the selected entity type to the query', () => {
      expect(getQueryParams().entityTypeRef.value).toBe(EAuthorizationEntityType.ACTIVITY)
    })
  })

  BddTest().when('the user has no contextual authorizations', () => {
    beforeEach(async () => {
      mockAuthorizations.value = []
      await mountWith()
    })

    BddTest().then('it should indicate that the tab is empty', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(true)
    })
  })

  BddTest().when('the query is loading', () => {
    beforeEach(async () => {
      mockIsFetching.value = true
      await mountWith()
    })

    BddTest().then('it should pass the loading state to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(true)
    })
  })

  BddTest().when('the query has failed', () => {
    beforeEach(async () => {
      mockError.value = new Error('Request failed')
      await mountWith()
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBe(mockError.value)
    })
  })

  BddTest().when('the page information is unavailable', () => {
    beforeEach(async () => {
      mockPageInfo.value = null as never
      await mountWith()
    })

    BddTest().then('it should not render pagination', () => {
      expect(getPagination().exists()).toBe(false)
    })
  })
})
