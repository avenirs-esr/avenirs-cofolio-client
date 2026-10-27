import type { VueWrapper } from '@vue/test-utils'
import { AvHeaderStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { FooterStub } from '@/common/components/Footer/Footer.stub'
import { SkipLinksStub } from '@/common/components/navigation/SkipLinks/SkipLinks.stub'
import { SwitchUniverseStub } from '@/common/components/navigation/SwitchUniverse/SwitchUniverse.stub'
import { ROUTES } from '@/common/constants'
import { useMenuBurgerStore } from '@/common/stores/menu-burger.store'
import { StaffNavigationStub } from '@/features/staff/global/components/navigation/StaffNavigation/StaffNavigation.stub'
import StaffLayout from '@/features/staff/global/layouts/StaffLayout/StaffLayout.vue'
import { StaffNotificationsPopoverStub } from '@/features/staff/user/components/overlays/StaffNotificationsPopover/StaffNotificationsPopover.stub'
import { StaffProfileDropdownStub } from '@/features/staff/user/components/overlays/StaffProfileDropdown/StaffProfileDropdown.stub'

const LANGUAGE = 'en'
const SEARCH_QUERY = 'search value'
const USERNAME = 'M. Dupont'

const selectLanguageMock = vi.fn()
const mockCanSwitchUniverse = ref(false)

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    universes: {
      canSwitch: mockCanSwitchUniverse
    }
  })
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
    StaffNavigation: StaffNavigationStub,
    Footer: FooterStub,
    RouterView: {
      name: 'RouterView',
      template: '<div data-testid="router-view" />'
    },
    QuerySuspense: QuerySuspenseStub,
    SkipLinks: SkipLinksStub
  }

  const getAvHeader = () => wrapper.findComponent(AvHeaderStub)
  const getFooter = () => wrapper.findComponent(FooterStub)
  const getMenuBurgerStore = () => useMenuBurgerStore()
  const getNavigation = () => wrapper.findComponent(StaffNavigationStub)
  const getNotificationsPopover = () => wrapper.findComponent(StaffNotificationsPopoverStub)
  const getProfileDropdown = () => wrapper.findComponent(StaffProfileDropdownStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getSkipLinks = () => wrapper.findComponent(SkipLinksStub)
  const getSwitchUniverse = () => wrapper.findComponent(SwitchUniverseStub)

  const mountWith = async ({ canSwitchUniverse = false }: { canSwitchUniverse?: boolean } = {}) => {
    vi.clearAllMocks()
    mockCanSwitchUniverse.value = canSwitchUniverse

    wrapper = mountComponent<typeof StaffLayout>(StaffLayout, {
      global: { stubs }
    })

    await vi.waitFor(() => {
      expect(getQuerySuspense().props('isLoading')).toBe(false)
    })
  }

  BddTest().and('a valid quicklinks', () => {
    BddTest().when('the layout is rendered', () => {
      beforeEach(async () => {
        await mountWith()
      })

      BddTest().then('it should render header, navigation and quicklinks correctly', () => {
        expect(getAvHeader().exists()).toBe(true)
        expect(getNavigation().exists()).toBe(true)
        expect(getNotificationsPopover().exists()).toBe(true)
        expect(getProfileDropdown().exists()).toBe(true)
      })

      BddTest().then('it should render the Footer component with correct props', () => {
        const footer = getFooter()

        expect(footer.exists()).toBe(true)
        expect(footer.props('accessibilityLink')).toBe(ROUTES.STAFF.ACCESSIBILITY)
        expect(footer.props('cguLink')).toBe(ROUTES.STAFF.CGU)
        expect(footer.props('cookiesLink')).toBe(ROUTES.STAFF.COOKIES)
        expect(footer.props('personalDataLink')).toBe(ROUTES.STAFF.PERSONAL_DATA)
      })

      BddTest().then('it should pass correct props to profile dropdown', () => {
        expect(getProfileDropdown().props('username')).toBe(USERNAME)
      })

      BddTest().then('it should not render switch universe', () => {
        expect(getSwitchUniverse().exists()).toBe(false)
      })

      BddTest().then('it should render the SkipLinks component', () => {
        expect(getSkipLinks().exists()).toBe(true)
      })

      BddTest().and('AvHeader emits update:modelValue', () => {
        beforeEach(async () => {
          getAvHeader().vm.$emit('update:modelValue', SEARCH_QUERY)
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should update searchQuery', () => {
          expect(wrapper.vm.searchQuery).toBe(SEARCH_QUERY)
        })
      })

      BddTest().and('AvHeader emits language-select', () => {
        beforeEach(async () => {
          getAvHeader().vm.$emit('language-select', LANGUAGE)
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should call selectLanguage from useLanguageSwitcher', () => {
          expect(selectLanguageMock).toHaveBeenCalledWith(LANGUAGE)
        })
      })

      BddTest().and('the searchQuery is updated', () => {
        beforeEach(async () => {
          wrapper.vm.searchQuery = SEARCH_QUERY
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should pass the value to AvHeader', () => {
          expect(getAvHeader().props('modelValue')).toBe(SEARCH_QUERY)
        })
      })

      BddTest().and('the menu burger drawer is displayed', () => {
        beforeEach(async () => {
          getMenuBurgerStore().displayMenuBurgerDrawer()
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should pass the store state to AvHeader', () => {
          expect(getAvHeader().props('menuOpen')).toBe(true)
        })
      })

      BddTest().and('AvHeader emits update:menuOpen', () => {
        beforeEach(async () => {
          getAvHeader().vm.$emit('update:menuOpen', true)
          await wrapper.vm.$nextTick()
        })

        BddTest().then('it should update the store', () => {
          expect(getMenuBurgerStore().showMenuBurgerDrawer).toBe(true)
        })
      })
    })

    BddTest().when('the layout is rendered with universe switch enabled', () => {
      beforeEach(async () => {
        await mountWith({ canSwitchUniverse: true })
      })

      BddTest().then('it should render switch universe', () => {
        expect(getSwitchUniverse().exists()).toBe(true)
      })
    })
  })
})
