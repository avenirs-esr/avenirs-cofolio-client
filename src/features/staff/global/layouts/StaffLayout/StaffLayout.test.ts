import type { VueWrapper } from '@vue/test-utils'
import { FooterStub } from '@/common/components/Footer/Footer.stub'
import { SwitchUniverseStub } from '@/common/components/SwitchUniverse/SwitchUniverse.stub'
import { ROUTES } from '@/common/constants'
import { StaffNavigationStub } from '@/features/staff/global/components/navigation/StaffNavigation/StaffNavigation.stub'
import StaffLayout from '@/features/staff/global/layouts/StaffLayout/StaffLayout.vue'
import { AvHeaderStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountWithRouter } from 'tests/utils'
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

BddTest().given('a staff layout component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StaffLayout>>

  const stubs = {
    AvHeader: AvHeaderStub,
    Footer: FooterStub,
    StaffNavigation: StaffNavigationStub,
    SwitchUniverse: SwitchUniverseStub
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    wrapper = await mountWithRouter<typeof StaffLayout>(StaffLayout, {
      global: { stubs }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the AvHeader component', () => {
      expect(wrapper.findComponent(AvHeaderStub).exists()).toBe(true)
    })

    BddTest().then('it should render the Footer component with correct props', () => {
      const footer = wrapper.findComponent(FooterStub)

      expect(footer.exists()).toBe(true)
      expect(footer.props('accessibilityLink')).toBe(ROUTES.STAFF.ACCESSIBILITY)
      expect(footer.props('cookiesLink')).toBe(ROUTES.STAFF.COOKIES)
      expect(footer.props('legalLink')).toBe(ROUTES.STAFF.LEGAL)
      expect(footer.props('personalDataLink')).toBe(ROUTES.STAFF.PERSONAL_DATA)
    })

    BddTest().then('it should render the StaffNavigation component', () => {
      expect(wrapper.findComponent(StaffNavigationStub).exists()).toBe(true)
    })

    BddTest().and('AvHeader emits update:modelValue', () => {
      beforeEach(async () => {
        const avHeader = wrapper.findComponent(AvHeaderStub)
        avHeader.vm.$emit('update:modelValue', 'test')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the searchQuery property', () => {
        expect(wrapper.vm.searchQuery).toBe('test')
      })
    })

    BddTest().and('searchQuery is updated', () => {
      let avHeader: VueWrapper<InstanceType<typeof AvHeaderStub>>

      beforeEach(async () => {
        avHeader = wrapper.findComponent(AvHeaderStub)
        wrapper.vm.searchQuery = 'test'
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should pass searchQuery as modelValue to AvHeader', async () => {
        expect(avHeader.props('modelValue')).toBe('test')
      })
    })

    BddTest().and('AvHeader emits language-select', () => {
      beforeEach(async () => {
        const avHeader = wrapper.findComponent(AvHeaderStub)
        avHeader.vm.$emit('language-select', 'en')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should call selectLanguage from useLanguageSwitcher', () => {
        expect(selectLanguageMock).toHaveBeenCalledWith('en')
      })
    })
  })
})
