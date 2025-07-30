import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import StudentProjectTrajectoriesExploreFuturesSection from './StudentProjectTrajectoriesExploreFuturesSection.vue'

describe('studentProjectTrajectoriesExploreFuturesSection', () => {
  describe('given an explore futures section component', () => {
    let wrapper: ReturnType<typeof mount<typeof StudentProjectTrajectoriesExploreFuturesSection>>

    beforeEach(() => {
      wrapper = mount<typeof StudentProjectTrajectoriesExploreFuturesSection>(StudentProjectTrajectoriesExploreFuturesSection)
    })

    describe('when the explore futures section is mounted', () => {
      it('then it should render the explore futures title', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.exists()).toBe(true)
        expect(titleElement.text()).toBe('Explorer mes futurs')
      })

      it('then it should have the correct CSS class', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.classes()).toContain('b1-bold')
      })
    })
  })
})
