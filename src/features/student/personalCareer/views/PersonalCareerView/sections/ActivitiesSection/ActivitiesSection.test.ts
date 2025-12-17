import ActivitiesSection from '@/features/student/personalCareer/views/PersonalCareerView/sections/ActivitiesSection/ActivitiesSection.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an activities section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivitiesSection>>

  beforeEach(() => {
    wrapper = mount(ActivitiesSection)
  })

  BddTest().when('the activities section is mounted', () => {
    BddTest().then('it should render the activities title', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.exists()).toBe(true)
      expect(titleElement.text()).toBe('Mes activités')
    })

    BddTest().then('it should have the correct CSS class', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.classes()).toContain('b1-bold')
    })
  })
})
