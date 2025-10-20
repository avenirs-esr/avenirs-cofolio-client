import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import StudentProjectExperiencesCareersSection from './StudentProjectExperiencesCareersSection.vue'

BddTest().given('a careers section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectExperiencesCareersSection>>

  beforeEach(() => {
    wrapper = mount(StudentProjectExperiencesCareersSection)
  })

  BddTest().when('the careers section is mounted', () => {
    BddTest().then('it should render the careers title', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.exists()).toBe(true)
      expect(titleElement.text()).toBe('Mon parcours')
    })

    BddTest().then('it should have the correct CSS class', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.classes()).toContain('b1-bold')
    })
  })
})
