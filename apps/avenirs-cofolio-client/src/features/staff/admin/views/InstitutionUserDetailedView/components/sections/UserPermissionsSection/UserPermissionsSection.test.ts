import type { BaseApiException } from '@avenirs-esr/shared'
import type { VueWrapper } from '@vue/test-utils'
import type { ExternalUserDetailDTO } from '@/api/avenir-esr'
import { AvIconTextStub, AvTabsStub, AvTabStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mockExternalUserDetail } from '@/__mocks__/fixtures/shared/external-user.fixtures'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { ICONS } from '@/common/constants'
import { PermissionsTab } from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserPermissionsSection/UserPermissionsSection.types'
import UserPermissionsSection from '@/features/staff/admin/views/InstitutionUserDetailedView/components/sections/UserPermissionsSection/UserPermissionsSection.vue'
import { ContextualPermissionsTabStub } from '@/features/staff/admin/views/InstitutionUserDetailedView/components/tabs/ContextualPermissionsTab/ContextualPermissionsTab.stub'
import { NotContextualPermissionsTabStub } from '@/features/staff/admin/views/InstitutionUserDetailedView/components/tabs/NotContextualPermissionsTab/NotContextualPermissionsTab.stub'

const routeQueryValue = ref<string>('NOT_CONTEXTUAL')

vi.mock('@vueuse/router', () => ({
  useRouteQuery: (_queryName: string, defaultValue: string) => {
    if (routeQueryValue.value === undefined) {
      routeQueryValue.value = defaultValue
    }
    return routeQueryValue
  },
}))

const stubs = {
  AvIconText: AvIconTextStub,
  QuerySuspense: QuerySuspenseStub,
  AvTabs: AvTabsStub,
  AvTab: AvTabStub,
  NotContextualPermissionsTab: NotContextualPermissionsTabStub,
  ContextualPermissionsTab: ContextualPermissionsTabStub,
}

BddTest().given('a user permissions section', () => {
  let wrapper: VueWrapper<InstanceType<typeof UserPermissionsSection>>

  const user = mockExternalUserDetail

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
  const getAvTabs = () => wrapper.findComponent(AvTabsStub)
  const getNotContextualTab = () => wrapper.findComponent(NotContextualPermissionsTabStub)
  const getContextualTab = () => wrapper.findComponent(ContextualPermissionsTabStub)

  beforeEach(() => {
    vi.clearAllMocks()
    routeQueryValue.value = 'NOT_CONTEXTUAL'
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

    BddTest().then('it should select the non-contextual tab by default', () => {
      expect(getAvTabs().props('modelValue')).toBe(PermissionsTab.NOT_CONTEXTUAL)
      expect(getNotContextualTab().exists()).toBe(true)
      expect(getContextualTab().exists()).toBe(false)
    })

    BddTest().then('it should pass the user to the non-contextual tab', () => {
      expect(getNotContextualTab().props('user')).toStrictEqual(user)
    })
  })

  BddTest().when('the route query selects the contextual tab', () => {
    beforeEach(async () => {
      routeQueryValue.value = 'CONTEXTUAL'
      await mountWith()
    })

    BddTest().then('it should select the contextual tab', () => {
      expect(getAvTabs().props('modelValue')).toBe(PermissionsTab.CONTEXTUAL)
      expect(getContextualTab().exists()).toBe(true)
      expect(getNotContextualTab().exists()).toBe(false)
    })

    BddTest().then('it should pass the user to the contextual tab', () => {
      expect(getContextualTab().props('user')).toStrictEqual(user)
    })
  })

  BddTest().when('the user selects the contextual tab', () => {
    beforeEach(async () => {
      await mountWith()
      await getAvTabs().vm.$emit('update:modelValue', PermissionsTab.CONTEXTUAL)
      await nextTick()
      await flushPromises()
    })

    BddTest().then('it should update the route query', () => {
      expect(routeQueryValue.value).toBe('CONTEXTUAL')
    })

    BddTest().then('it should display the contextual tab content', () => {
      expect(getContextualTab().exists()).toBe(true)
      expect(getNotContextualTab().exists()).toBe(false)
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
      expect(getAvTabs().exists()).toBe(false)
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
