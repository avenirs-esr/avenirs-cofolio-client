import type { VueWrapper } from '@vue/test-utils'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { AvIconTextStub, AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { ICONS } from '@/common/constants'
import UserPermissionsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserPermissionsSection/UserPermissionsSection.vue'
import ContextualPermissionsTab from '@/features/staff/admin/views/InstitutionUserDetailedView/components/tabs/ContextualPermissionsTab/ContextualPermissionsTab.vue'
import NotContextualPermissionsTab from '@/features/staff/admin/views/InstitutionUserDetailedView/components/tabs/NotContextualPermissionsTab/NotContextualPermissionsTab.vue'

BddTest().given('a user permissions section', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserPermissionsSection>>

  const user = mockExternalUserDetail

  const stubs = {
    AvIconText: AvIconTextStub,
    QuerySuspense: QuerySuspenseStub,
    AvTabs: AvTabsStub,
    AvTab: AvTabStub,
    NotContextualPermissionsTab,
    ContextualPermissionsTab,
  }

  const mountWith = async (options: {
    user?: ExternalUserDetailDTO
    isLoading?: boolean
    error?: BaseApiException | null
  } = {}) => {
    wrapper = mountComponent(UserPermissionsSection, {
      props: {
        user: options.user ?? user,
        isLoading: options.isLoading,
        error: options.error,
      },
      global: { stubs },
    })

    await flushPromises()
  }

  const getAvIconText = () => wrapper.findComponent(AvIconTextStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getNotContextualTab = () => wrapper.findComponent(NotContextualPermissionsTab)
  const getContextualTab = () => wrapper.findComponent(ContextualPermissionsTab)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the section is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should display its title and icon', () => {
      expect(getAvIconText().exists()).toBe(true)
      expect(getAvIconText().props('text')).toBe('Rôles et permissions')
      expect(getAvIconText().props('icon')).toBe(ICONS.PERMISSIONS)
      expect(getAvIconText().props('iconColor')).toBe('var(--text2)')
      expect(getAvIconText().props('typographyClass')).toBe('n4')
    })

    BddTest().then('it should render QuerySuspense', () => {
      expect(getQuerySuspense().exists()).toBe(true)
    })

    BddTest().then('it should pass the loading state and error to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBeUndefined()
      expect(getQuerySuspense().props('error')).toBeNull()
    })

    BddTest().then('it should only render the first tab content', () => {
      expect(getNotContextualTab().exists()).toBe(true)
      expect(getContextualTab().exists()).toBe(false)
    })

    BddTest().then('it should pass the user to first tab', () => {
      expect(getNotContextualTab().props('user')).toStrictEqual(user)
    })
  })

  BddTest().when('the section receives loading and error props', () => {
    const error = { message: 'Request failed' } as BaseApiException

    beforeEach(async () => {
      await mountWith({
        isLoading: true,
        error,
      })
    })

    BddTest().then('it should pass the loading state and error to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(true)
      expect(getQuerySuspense().props('error')).toStrictEqual(error)
    })

    BddTest().then('it should hide the tabs', () => {
      expect(getNotContextualTab().exists()).toBe(false)
      expect(getContextualTab().exists()).toBe(false)
    })
  })

  BddTest().when('the section receives an explicit false loading state and no error', () => {
    beforeEach(async () => {
      await mountWith({
        isLoading: false,
        error: null,
      })
    })

    BddTest().then('it should pass these values to QuerySuspense', () => {
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('error')).toBeNull()
    })
  })
})
