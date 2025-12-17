import DeclaredProgramsSection from '@/features/student/personalCareer/views/PersonalCareerView/sections/DeclaredProgramsSection/DeclaredProgramsSection.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an educations section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramsSection>>

  beforeEach(() => {
    wrapper = mount(DeclaredProgramsSection)
  })

  BddTest().when('the educations section is mounted', () => {
    BddTest().then('it should render the educations title', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.exists()).toBe(true)
      expect(titleElement.text()).toBe('Mes formations')
    })

    BddTest().then('it should have the correct CSS class', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.classes()).toContain('b1-bold')
    })
  })
})
