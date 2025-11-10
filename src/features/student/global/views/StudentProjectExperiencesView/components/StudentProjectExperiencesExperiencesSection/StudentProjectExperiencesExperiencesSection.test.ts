import StudentProjectExperiencesExperiencesSection from '@/features/student/global/views/StudentProjectExperiencesView/components/StudentProjectExperiencesExperiencesSection/StudentProjectExperiencesExperiencesSection.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an experiences section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectExperiencesExperiencesSection>>

  beforeEach(() => {
    wrapper = mount(StudentProjectExperiencesExperiencesSection)
  })

  BddTest().when('the experiences section is mounted', () => {
    BddTest().then('it should render the experiences title', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.exists()).toBe(true)
      expect(titleElement.text()).toBe('Mes expériences')
    })

    BddTest().then('it should have the correct CSS class', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.classes()).toContain('b1-bold')
    })
  })
})
