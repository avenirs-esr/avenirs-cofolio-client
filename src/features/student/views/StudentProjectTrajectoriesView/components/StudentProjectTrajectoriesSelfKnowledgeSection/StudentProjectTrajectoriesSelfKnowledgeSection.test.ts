import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import StudentProjectTrajectoriesSelfKnowledgeSection from './StudentProjectTrajectoriesSelfKnowledgeSection.vue'

describe('studentProjectTrajectoriesSelfKnowledgeSection', () => {
  describe('given a self knowledge section component', () => {
    let wrapper: ReturnType<typeof mount<typeof StudentProjectTrajectoriesSelfKnowledgeSection>>

    beforeEach(() => {
      wrapper = mount<typeof StudentProjectTrajectoriesSelfKnowledgeSection>(StudentProjectTrajectoriesSelfKnowledgeSection)
    })

    describe('when the self knowledge section is mounted', () => {
      it('then it should render the self knowledge title', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.exists()).toBe(true)
        expect(titleElement.text()).toBe('Me connaître')
      })

      it('then it should have the correct CSS class', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.classes()).toContain('b1-bold')
      })
    })
  })
})
