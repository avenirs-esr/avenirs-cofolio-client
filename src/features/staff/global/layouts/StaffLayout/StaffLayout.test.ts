import type { VueWrapper } from '@vue/test-utils'
import { FooterStub } from '@/common/components/Footer/Footer.stub'
import { SwitchUniverseStub } from '@/common/components/SwitchUniverse/SwitchUniverse.stub'
import { ROUTES } from '@/common/constants'
import StaffLayout from '@/features/staff/global/layouts/StaffLayout/StaffLayout.vue'
import { AvHeaderStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const selectLanguageMock = vi.fn()

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
    StaffProfilePopover: {
      name: 'StaffProfilePopover',
      props: ['username'],
      template: '<div data-testid="profile-popover" />'
    },
    StaffNavigation: {
      name: 'StaffNavigation',
      template: '<nav data-testid="navigation">Navigation</nav>'
    },
    Footer: FooterStub,
    RouterView: {
      name: 'RouterView',
      template: '<div data-testid="router-view" />'
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().and('a valid summary', () => {
    BddTest().when('the layout is rendered', () => {
      beforeEach(() => {
        wrapper = mountComponent<typeof StaffLayout>(StaffLayout, {
          global: { stubs }
        })
      })

      BddTest().then('it should render header, navigation and quicklinks correctly', () => {
        expect(wrapper.findComponent({ name: 'AvHeader' }).exists()).toBe(true)
        expect(wrapper.find('[data-testid="navigation"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="profile-popover"]').exists()).toBe(true)
      })

      BddTest().then('it should render the Footer component with correct props', () => {
        const footer = wrapper.findComponent(FooterStub)

        expect(footer.exists()).toBe(true)
        expect(footer.props('accessibilityLink')).toBe(ROUTES.STAFF.ACCESSIBILITY)
        expect(footer.props('cookiesLink')).toBe(ROUTES.STAFF.COOKIES)
        expect(footer.props('legalLink')).toBe(ROUTES.STAFF.LEGAL)
        expect(footer.props('personalDataLink')).toBe(ROUTES.STAFF.PERSONAL_DATA)
      })

      BddTest().then('it should pass correct props to profile popover', async () => {
        const profilePopover = wrapper.findComponent({ name: 'StaffProfilePopover' })

        await vi.waitFor(() => expect(profilePopover.props('username')).toBe('M. Dupont'))
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
  })
})
