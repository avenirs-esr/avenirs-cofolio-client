import ExperiencesSection from '@/features/student/personalCareer/views/PersonalCareerView/sections/ExperiencesSection/ExperiencesSection.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an experiences section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ExperiencesSection>>

  const stubs = {
    DeclaredExperiencesTab: defineComponent({
      name: 'DeclaredExperiencesTab',
      template: '<div data-testid="declared-experiences-tab-stub"></div>'
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

    BddTest().then('it should render the declared experiences tab', () => {
      const declaredExperiencesTab = wrapper.findComponent({ name: 'DeclaredExperiencesTab' })
      expect(declaredExperiencesTab.exists()).toBe(true)
    })
  })
})
