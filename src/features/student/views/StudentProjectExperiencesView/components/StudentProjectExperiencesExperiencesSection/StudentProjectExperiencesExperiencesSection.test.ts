import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import StudentProjectExperiencesExperiencesSection from './StudentProjectExperiencesExperiencesSection.vue'

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
