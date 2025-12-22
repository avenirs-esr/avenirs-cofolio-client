import ProgramsSection from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/ProgramsSection.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a programs section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProgramsSection>>

  const stubs = {
    DeclaredProgramsTab: defineComponent({
      name: 'DeclaredProgramsTab',
      template: '<div data-testid="declared-programs-tab-stub"></div>'
    }),
    VerifiedProgramsTab: defineComponent({
      name: 'VerifiedProgramsTab',
      template: '<div data-testid="verified-programs-tab-stub"></div>'
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(ProgramsSection, {
      global: { stubs }
    })
  })

  BddTest().when('the programs section is mounted', () => {
    BddTest().then('it should render', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the tabs component', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(tabs.exists()).toBe(true)
    })

    BddTest().then('it should render two tab buttons', () => {
      const tabButtons = wrapper.findAll('[role="tab"]')
      expect(tabButtons).toHaveLength(2)
    })

    BddTest().then('it should pass FLARE icon to the declared programs tab', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      const tabSlots = tabs.vm.$slots.default?.()
      expect(tabSlots[0].props?.icon).toBe(MDI_ICONS.FLARE)
    })

    BddTest().then('it should pass CHECK_DECAGRAM_OUTLINE icon to the verified programs tab', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      const tabSlots = tabs.vm.$slots.default?.()
      expect(tabSlots[1].props?.icon).toBe(MDI_ICONS.CHECK_DECAGRAM_OUTLINE)
    })

    BddTest().and('the declared programs tab is active by default', () => {
      BddTest().then('it should have the correct title', () => {
        const tabButtons = wrapper.findAll('[role="tab"]')
        expect(tabButtons[0].text()).toContain('Mes formations déclarées')
      })

      BddTest().then('it should render the declared programs tab content', () => {
        const content = wrapper.findComponent({ name: 'DeclaredProgramsTab' })
        expect(content.exists()).toBe(true)
      })

      BddTest().then('it should not render the verified programs tab content', () => {
        const content = wrapper.findComponent({ name: 'VerifiedProgramsTab' })
        expect(content.exists()).toBe(false)
      })
    })
  })

  BddTest().when('the verified programs tab is clicked', () => {
    beforeEach(async () => {
      const tabButtons = wrapper.findAll('[role="tab"]')
      await tabButtons[1].trigger('click')
    })

    BddTest().then('it should have the correct title', () => {
      const tabButtons = wrapper.findAll('[role="tab"]')
      expect(tabButtons[1].text()).toContain('Mes formations vérifiées')
    })

    BddTest().then('it should render the verified programs tab content', () => {
      const content = wrapper.findComponent({ name: 'VerifiedProgramsTab' })
      expect(content.exists()).toBe(true)
    })

    BddTest().then('it should not render the declared programs tab content', () => {
      const content = wrapper.findComponent({ name: 'DeclaredProgramsTab' })
      expect(content.exists()).toBe(false)
    })
  })
})
