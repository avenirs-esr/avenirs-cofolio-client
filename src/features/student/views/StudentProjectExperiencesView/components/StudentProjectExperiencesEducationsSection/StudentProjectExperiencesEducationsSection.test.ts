import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import StudentProjectExperiencesEducationsSection from './StudentProjectExperiencesEducationsSection.vue'

describe('studentProjectExperiencesEducationsSection', () => {
  describe('given an educations section component', () => {
    let wrapper: ReturnType<typeof mount<typeof StudentProjectExperiencesEducationsSection>>

    beforeEach(() => {
      wrapper = mount<typeof StudentProjectExperiencesEducationsSection>(StudentProjectExperiencesEducationsSection)
    })

    describe('when the educations section is mounted', () => {
      it('then it should render the educations title', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.exists()).toBe(true)
        expect(titleElement.text()).toBe('Mes formations')
      })

      it('then it should have the correct CSS class', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.classes()).toContain('b1-bold')
      })
    })
  })
})
