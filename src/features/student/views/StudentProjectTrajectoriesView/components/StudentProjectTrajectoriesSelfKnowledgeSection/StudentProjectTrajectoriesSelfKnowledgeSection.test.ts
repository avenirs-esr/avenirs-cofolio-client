import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import StudentProjectTrajectoriesSelfKnowledgeSection from './StudentProjectTrajectoriesSelfKnowledgeSection.vue'

BddTest().given('a self knowledge section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectTrajectoriesSelfKnowledgeSection>>

  beforeEach(() => {
    wrapper = mount(StudentProjectTrajectoriesSelfKnowledgeSection)
  })

  BddTest().when('the self knowledge section is mounted', () => {
    BddTest().then('it should render the self knowledge title', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.exists()).toBe(true)
      expect(titleElement.text()).toBe('Me connaître')
    })

    BddTest().then('it should have the correct CSS class', () => {
      const titleElement = wrapper.find('.b1-bold')
      expect(titleElement.classes()).toContain('b1-bold')
    })
  })
})
