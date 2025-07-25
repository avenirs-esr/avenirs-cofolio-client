import { mount } from '@vue/test-utils'
import StudentProjectExperiencesActivitiesSection from 'src/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesActivitiesSection/StudentProjectExperiencesActivitiesSection.vue'
import { beforeEach, describe, expect, it } from 'vitest'

describe('studentProjectExperiencesActivitiesSection', () => {
  describe('given an activities section component', () => {
    let wrapper: ReturnType<typeof mount<typeof StudentProjectExperiencesActivitiesSection>>

    beforeEach(() => {
      wrapper = mount<typeof StudentProjectExperiencesActivitiesSection>(StudentProjectExperiencesActivitiesSection)
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
