import ExperiencesSection from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/ExperiencesSection.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an experiences section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ExperiencesSection>>

  const stubs = {
    DeclaredExperiencesTab: defineComponent({
      name: 'DeclaredExperiencesTab',
      template: '<div data-testid="declared-experiences-tab-stub"></div>'
    }),
    VerifiedExperiencesTab: defineComponent({
      name: 'VerifiedExperiencesTab',
      template: '<div data-testid="verified-experiences-tab-stub"></div>'
    }),
    AmsTab: defineComponent({
      name: 'AmsTab',
      template: '<div data-testid="amss-tab-stub"></div>'
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = mount(ExperiencesSection, {
      global: { stubs }
    })
  })

  BddTest().when('the experiences section is mounted', () => {
    BddTest().then('it should render', () => {
      expect(wrapper.exists()).toBe(true)
    })

    BddTest().then('it should render the tabs component', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      expect(tabs.exists()).toBe(true)
    })

    BddTest().then('it should render three tab buttons', () => {
      const tabButtons = wrapper.findAll('[role="tab"]')
      expect(tabButtons).toHaveLength(3)
    })

    BddTest().then('it should pass FLARE icon to the declared experiences tab', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      const tabSlots = tabs.vm.$slots.default?.()
      expect(tabSlots[0].props?.icon).toBe(MDI_ICONS.FLARE)
    })

    BddTest().then('it should pass CHECK_DECAGRAM_OUTLINE icon to the verified experiences tab', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      const tabSlots = tabs.vm.$slots.default?.()
      expect(tabSlots[1].props?.icon).toBe(MDI_ICONS.CHECK_DECAGRAM_OUTLINE)
    })

    BddTest().then('it should pass BOOK_OUTLINE icon to the amss tab', () => {
      const tabs = wrapper.findComponent({ name: 'AvTabs' })
      const tabSlots = tabs.vm.$slots.default?.()
      expect(tabSlots[2].props?.icon).toBe(MDI_ICONS.BOOK_OUTLINE)
    })

    BddTest().and('the declared experiences tab is active by default', () => {
      BddTest().then('it should have the correct title', () => {
        const tabButtons = wrapper.findAll('[role="tab"]')
        expect(tabButtons[0].text()).toContain('Mes expériences déclarées')
      })

      BddTest().then('it should render the declared experiences tab content', () => {
        const content = wrapper.findComponent({ name: 'DeclaredExperiencesTab' })
        expect(content.exists()).toBe(true)
      })

      BddTest().then('it should not render the verified experiences tab content', () => {
        const content = wrapper.findComponent({ name: 'VerifiedExperiencesTab' })
        expect(content.exists()).toBe(false)
      })

      BddTest().then('it should not render the amss tab content', () => {
        const content = wrapper.findComponent({ name: 'AmssTab' })
        expect(content.exists()).toBe(false)
      })
    })
  })

  BddTest().when('the verified experiences tab is clicked', () => {
    beforeEach(async () => {
      const tabButtons = wrapper.findAll('[role="tab"]')
      await tabButtons[1].trigger('click')
    })

    BddTest().then('it should have the correct title', () => {
      const tabButtons = wrapper.findAll('[role="tab"]')
      expect(tabButtons[1].text()).toContain('Mes expériences vérifiées')
    })

    BddTest().then('it should render the verified experiences tab content', () => {
      const content = wrapper.findComponent({ name: 'VerifiedExperiencesTab' })
      expect(content.exists()).toBe(true)
    })

    BddTest().then('it should not render the declared experiences tab content', () => {
      const content = wrapper.findComponent({ name: 'DeclaredExperiencesTab' })
      expect(content.exists()).toBe(false)
    })

    BddTest().then('it should not render the amss tab content', () => {
      const content = wrapper.findComponent({ name: 'AmssTab' })
      expect(content.exists()).toBe(false)
    })
  })

  BddTest().when('the amss tab is clicked', () => {
    beforeEach(async () => {
      const tabButtons = wrapper.findAll('[role="tab"]')
      await tabButtons[2].trigger('click')
    })

    BddTest().then('it should have the correct title', () => {
      const tabButtons = wrapper.findAll('[role="tab"]')
      expect(tabButtons[2].text()).toContain('Mes AMS')
    })

    BddTest().then('it should render the amss tab content', () => {
      const content = wrapper.findComponent({ name: 'AmsTab' })
      expect(content.exists()).toBe(true)
    })

    BddTest().then('it should not render the declared experiences tab content', () => {
      const content = wrapper.findComponent({ name: 'DeclaredExperiencesTab' })
      expect(content.exists()).toBe(false)
    })

    BddTest().then('it should not render the verified experiences tab content', () => {
      const content = wrapper.findComponent({ name: 'VerifiedExperiencesTab' })
      expect(content.exists()).toBe(false)
    })
  })
})
