import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import StudentProjectTrajectoriesBuildProjectSection from './StudentProjectTrajectoriesBuildProjectSection.vue'

describe('studentProjectTrajectoriesBuildProjectSection', () => {
  describe('given a build project section component', () => {
    let wrapper: ReturnType<typeof mount<typeof StudentProjectTrajectoriesBuildProjectSection>>

    beforeEach(() => {
      wrapper = mount<typeof StudentProjectTrajectoriesBuildProjectSection>(StudentProjectTrajectoriesBuildProjectSection)
    })

    describe('when the build project section is mounted', () => {
      it('then it should render the build project title', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.exists()).toBe(true)
        expect(titleElement.text()).toBe('Bâtir mon projet')
      })

      it('then it should have the correct CSS class', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.classes()).toContain('b1-bold')
      })
    })
  })
})
