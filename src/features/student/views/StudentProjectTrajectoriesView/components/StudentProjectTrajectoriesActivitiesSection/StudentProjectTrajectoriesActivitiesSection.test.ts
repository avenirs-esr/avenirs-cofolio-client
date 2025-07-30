import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import StudentProjectTrajectoriesActivitiesSection from './StudentProjectTrajectoriesActivitiesSection.vue'

describe('studentProjectTrajectoriesActivitiesSection', () => {
  describe('given an activities section component', () => {
    let wrapper: ReturnType<typeof mount<typeof StudentProjectTrajectoriesActivitiesSection>>

    beforeEach(() => {
      wrapper = mount<typeof StudentProjectTrajectoriesActivitiesSection>(StudentProjectTrajectoriesActivitiesSection)
    })

    describe('when the activities section is mounted', () => {
      it('then it should render the activities title', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.exists()).toBe(true)
        expect(titleElement.text()).toBe('Mes activités')
      })

      it('then it should have the correct CSS class', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.classes()).toContain('b1-bold')
      })
    })
  })
})
