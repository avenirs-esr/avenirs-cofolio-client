import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import StudentProjectTrajectoriesExploreFuturesSection from './StudentProjectTrajectoriesExploreFuturesSection.vue'

BddTest().given('an explore futures section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectTrajectoriesExploreFuturesSection>>

  beforeEach(() => {
    wrapper = mount(StudentProjectTrajectoriesExploreFuturesSection)
  })

  BddTest().when('the explore futures section is mounted', () => {
    BddTest().then('it should render the explore futures title', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.exists()).toBe(true)
      expect(titleElement.text()).toBe('Explorer mes futurs')
    })

    BddTest().then('it should have the correct CSS class', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.classes()).toContain('b1-bold')
    })
  })
})
