import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'
import StudentProjectTrajectoriesActivitiesSection from './StudentProjectTrajectoriesActivitiesSection.vue'

BddTest().given('an activities section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectTrajectoriesActivitiesSection>>

  beforeEach(() => {
    wrapper = mount(StudentProjectTrajectoriesActivitiesSection)
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
