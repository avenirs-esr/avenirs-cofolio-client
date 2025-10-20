import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import StudentProjectTrajectoriesTrajectoriesSection from './StudentProjectTrajectoriesTrajectoriesSection.vue'

BddTest().given('a trajectories section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectTrajectoriesTrajectoriesSection>>

  beforeEach(() => {
    wrapper = mount(StudentProjectTrajectoriesTrajectoriesSection)
  })

  BddTest().when('the trajectories section is mounted', () => {
    BddTest().then('it should render the trajectories title', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.exists()).toBe(true)
      expect(titleElement.text()).toBe('Mes Trajectoires')
    })

    BddTest().then('it should have the correct CSS class', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.classes()).toContain('b1-bold')
    })
  })
})
