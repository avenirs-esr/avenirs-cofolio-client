import type { VueWrapper } from '@vue/test-utils'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { UserPermissionsTableStub } from '@/features/staff/admin/views/InstitutionUserDetailedView/components/dataDisplay/UserPermissionsTable/UserPermissionsTable.stub'
import NotContextualPermissionsTab from '@/features/staff/admin/views/InstitutionUserDetailedView/components/tabs/NotContextualPermissionsTab/NotContextualPermissionsTab.vue'

BddTest().given('a not contextual permissions tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof NotContextualPermissionsTab>>

  const user = mockExternalUserDetail

  const stubs = {
    QuerySuspense: QuerySuspenseStub,
    UserPermissionsTable: UserPermissionsTableStub,
  }

  const mountWith = async (options: {
    user?: ExternalUserDetailDTO
  } = {}) => {
    wrapper = mountComponent(NotContextualPermissionsTab, {
      props: {
        user: options.user ?? user,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getPermissionsTable = () => wrapper.findComponent(UserPermissionsTableStub)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the tab is mounted', () => {
    beforeEach(async () => {
      await mountWith()
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

    BddTest().then('it should indicate whether the roles are empty', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
    })

    BddTest().then('it should pass the roles returned by the API to the table', () => {
      expect(getPermissionsTable().exists()).toBe(true)
      expect(getPermissionsTable().props('roles')).toHaveLength(12)
    })
  })

  BddTest().when('the user has no id', () => {
    beforeEach(async () => {
      await mountWith({
        user: {
          ...user,
          id: '',
        },
      })
    })

    BddTest().then('it should indicate that the tab is empty', () => {
      expect(getQuerySuspense().props('isEmpty')).toBe(true)
    })

    BddTest().then('it should not render the permissions table', () => {
      expect(getPermissionsTable().exists()).toBe(false)
    })
  })
})
