import type { VueWrapper } from '@vue/test-utils'
import { FooterStub } from '@/common/components/Footer/Footer.stub'
import { SwitchUniverseStub } from '@/common/components/SwitchUniverse/SwitchUniverse.stub'
import { ROUTES } from '@/common/constants'
import StudentLayout from '@/features/student/global/layouts/StudentLayout/StudentLayout.vue'
import { AvHeaderStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const selectLanguageMock = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useLanguageSwitcher: () => ({
      selectLanguage: selectLanguageMock
    }),
  }
})

BddTest().given('a student layout', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentLayout>>

  const stubs = {
    AvHeader: AvHeaderStub,
    SwitchUniverse: SwitchUniverseStub,
    StudentMailboxPopover: {
      name: 'StudentMailboxPopover',
      props: ['messagesCount'],
      template: '<div data-testid="mailbox-popover" />'
    },
    StudentNotificationsPopover: {
      name: 'StudentNotificationsPopover',
      props: ['notificationsCount'],
      template: '<div data-testid="notifications-popover" />'
    },
    StudentProfilePopover: {
      name: 'StudentProfilePopover',
      props: ['username'],
      template: '<div data-testid="profile-popover" />'
    },
    StudentNavigation: {
      name: 'StudentNavigation',
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
      beforeEach(async () => {
        wrapper = mountComponent<typeof StudentLayout>(StudentLayout, {
          global: { stubs }
        })
      })

      BddTest().then('it should render header, navigation and quicklinks correctly', async () => {
        expect(wrapper.findComponent({ name: 'AvHeader' }).exists()).toBe(true)
        expect(wrapper.find('[data-testid="navigation"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="mailbox-popover"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="notifications-popover"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="profile-popover"]').exists()).toBe(true)
      })

      BddTest().then('it should render the Footer component with correct props', () => {
        const footer = wrapper.findComponent(FooterStub)

        expect(footer.exists()).toBe(true)
        expect(footer.props('accessibilityLink')).toBe(ROUTES.STUDENT.ACCESSIBILITY)
        expect(footer.props('cookiesLink')).toBe(ROUTES.STUDENT.COOKIES)
        expect(footer.props('legalLink')).toBe(ROUTES.STUDENT.LEGAL)
        expect(footer.props('personalDataLink')).toBe(ROUTES.STUDENT.PERSONAL_DATA)
      })

      BddTest().then('it should pass correct props to profile popover', async () => {
        const profilePopover = wrapper.findComponent({ name: 'StudentProfilePopover' })
        await vi.waitFor(() => expect(profilePopover.props('username')).toBe('J. Moulin'))
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
        const avHeader = wrapper.findComponent(AvHeaderStub)
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
