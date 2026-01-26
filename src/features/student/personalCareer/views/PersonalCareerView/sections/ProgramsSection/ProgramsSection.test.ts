import ProgramsSection from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/ProgramsSection.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a programs section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProgramsSection>>

  const stubs = {
    DeclaredProgramsTab: defineComponent({
      name: 'DeclaredProgramsTab',
      template: '<div data-testid="declared-programs-tab-stub"></div>'
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

    BddTest().then('it should render the declared programs tab content', () => {
      const content = wrapper.findComponent({ name: 'DeclaredProgramsTab' })
      expect(content.exists()).toBe(true)
    })
  })
})
