import type { VueWrapper } from '@vue/test-utils'
import { FooterStub } from '@/common/components/Footer/Footer.stub'
import { SkipLinksStub } from '@/common/components/navigation/SkipLinks/SkipLinks.stub'
import { QuerySuspenseStub } from '@/common/components/QuerySuspense/QuerySuspense.stub'
import { SwitchUniverseStub } from '@/common/components/SwitchUniverse/SwitchUniverse.stub'
import { ROUTES } from '@/common/constants'
import { useMenuBurgerStore } from '@/common/stores/menu-burger.store'
import StaffLayout from '@/features/staff/global/layouts/StaffLayout/StaffLayout.vue'
import { StaffNotificationsPopoverStub } from '@/features/staff/user/components/overlays/StaffNotificationsPopover/StaffNotificationsPopover.stub'
import { StaffProfileDropdownStub } from '@/features/staff/user/components/overlays/StaffProfileDropdown/StaffProfileDropdown.stub'
import { AvHeaderStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockUseAuthStore = vi.hoisted(() => vi.fn(() => ({
  canSwitchProfile: false
})))
const selectLanguageMock = vi.fn()

vi.mock('@/features/auth/global/stores/auth.store', () => ({
  useAuthStore: mockUseAuthStore
}))

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useLanguageSwitcher: () => ({
      languageSelector: [],
      selectLanguage: selectLanguageMock
    }),
    useBaseApiExceptionToast: vi.fn()
  }
})

BddTest().given('a staff layout', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffLayout>>

  const stubs = {
    AvHeader: AvHeaderStub,
    SwitchUniverse: SwitchUniverseStub,
    StaffNotificationsPopover: StaffNotificationsPopoverStub,
    StaffProfileDropdown: StaffProfileDropdownStub,
    StaffNavigation: {
      name: 'StaffNavigation',
      template: '<nav data-testid="navigation">Navigation</nav>'
    },
    Footer: FooterStub,
    RouterView: {
      name: 'RouterView',
      template: '<div data-testid="router-view" />'
    },
    QuerySuspense: QuerySuspenseStub,
    SkipLinks: SkipLinksStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuthStore.mockReturnValue({
      canSwitchProfile: false
    })
  })

  BddTest().and('a valid quicklinks', () => {
    BddTest().when('the layout is rendered', () => {
      beforeEach(async () => {
        wrapper = mountComponent<typeof StaffLayout>(StaffLayout, {
          global: { stubs }
        })
        await vi.waitFor(() => {
          const querySuspense = wrapper.findComponent(QuerySuspenseStub) as VueWrapper<InstanceType<typeof QuerySuspenseStub>>
          expect(querySuspense.props('isLoading')).toBe(false)
        })
      })

      BddTest().then('it should render header, navigation and quicklinks correctly', () => {
        expect(wrapper.findComponent({ name: 'AvHeader' }).exists()).toBe(true)
        expect(wrapper.find('[data-testid="navigation"]').exists()).toBe(true)
        expect(wrapper.findComponent(StaffNotificationsPopoverStub).exists()).toBe(true)
        expect(wrapper.findComponent(StaffProfileDropdownStub).exists()).toBe(true)
      })

      BddTest().then('it should render the Footer component with correct props', () => {
        const footer = wrapper.findComponent(FooterStub)

        expect(footer.exists()).toBe(true)
        expect(footer.props('accessibilityLink')).toBe(ROUTES.STAFF.ACCESSIBILITY)
        expect(footer.props('cguLink')).toBe(ROUTES.STAFF.CGU)
        expect(footer.props('cookiesLink')).toBe(ROUTES.STAFF.COOKIES)
        expect(footer.props('personalDataLink')).toBe(ROUTES.STAFF.PERSONAL_DATA)
      })

      BddTest().then('it should pass correct props to profile dropdown', async () => {
        const profileDropdown = wrapper.findComponent(StaffProfileDropdownStub)

        await vi.waitFor(() => expect(profileDropdown.props('username')).toBe('M. Dupont'))
      })

      BddTest().then('it should not render switch universe', () => {
        expect(wrapper.findComponent(SwitchUniverseStub).exists()).toBe(false)
      })

      BddTest().then('it should render the SkipLinks component', () => {
        expect(wrapper.findComponent(SkipLinksStub).exists()).toBe(true)
      })
    })

    BddTest().when('the layout is rendered with profile switch enabled', () => {
      beforeEach(async () => {
        mockUseAuthStore.mockReturnValue({
          canSwitchProfile: true
        })
        wrapper = mountComponent<typeof StaffLayout>(StaffLayout, {
          global: { stubs }
        })
        await vi.waitFor(() => {
          const querySuspense = wrapper.findComponent(QuerySuspenseStub) as VueWrapper<InstanceType<typeof QuerySuspenseStub>>
          expect(querySuspense.props('isLoading')).toBe(false)
        })
      })

      BddTest().then('it should render switch universe', () => {
        expect(wrapper.findComponent(SwitchUniverseStub).exists()).toBe(true)
      })
    })

    BddTest().when('AvHeader emits update:modelValue', () => {
      BddTest().then('it should update searchQuery', async () => {
        const avHeader = wrapper.findComponent({ name: 'AvHeader' })

        avHeader.vm.$emit('update:modelValue', 'test search')
        await wrapper.vm.$nextTick()

        expect(wrapper.vm.searchQuery).toBe('test search')
      })
    })

    BddTest().when('AvHeader emits language-select', () => {
      beforeEach(async () => {
        const avHeader = wrapper.findComponent({ name: 'AvHeader' })

        avHeader.vm.$emit('language-select', 'en')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should call selectLanguage from useLanguageSwitcher', () => {
        expect(selectLanguageMock).toHaveBeenCalledWith('en')
      })
    })

    BddTest().when('the searchQuery is updated', () => {
      BddTest().then('it should pass the value to AvHeader', async () => {
        wrapper.vm.searchQuery = 'search value'
        await wrapper.vm.$nextTick()

        const avHeader = wrapper.findComponent({ name: 'AvHeader' })

        expect(avHeader.props('modelValue')).toBe('search value')
      })
    })

    BddTest().when('the menu burger state changes', () => {
      BddTest().then('it should pass the store state to AvHeader', async () => {
        const menuBurgerStore = useMenuBurgerStore()
        menuBurgerStore.displayMenuBurgerDrawer()
        await wrapper.vm.$nextTick()

        const avHeader = wrapper.findComponent(AvHeaderStub)
        expect(avHeader.props('menuOpen')).toBe(true)
      })

      BddTest().then('it should update the store when AvHeader emits update:menuOpen', async () => {
        const avHeader = wrapper.findComponent(AvHeaderStub)

        avHeader.vm.$emit('update:menuOpen', true)
        await wrapper.vm.$nextTick()

        expect(useMenuBurgerStore().showMenuBurgerDrawer).toBe(true)
      })
    })
  })
})
