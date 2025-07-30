import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import StudentProjectTrajectoriesTrajectoriesSection from './StudentProjectTrajectoriesTrajectoriesSection.vue'

describe('studentProjectTrajectoriesTrajectoriesSection', () => {
  describe('given a trajectories section component', () => {
    let wrapper: ReturnType<typeof mount<typeof StudentProjectTrajectoriesTrajectoriesSection>>

    beforeEach(() => {
      wrapper = mount<typeof StudentProjectTrajectoriesTrajectoriesSection>(StudentProjectTrajectoriesTrajectoriesSection)
    })

    describe('when the trajectories section is mounted', () => {
      it('then it should render the trajectories title', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.exists()).toBe(true)
        expect(titleElement.text()).toBe('Mes Trajectoires')
      })

      it('then it should have the correct CSS class', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.classes()).toContain('b1-bold')
      })
    })
  })
})
