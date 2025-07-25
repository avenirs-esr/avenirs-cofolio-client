import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import StudentProjectExperiencesExperiencesSection from './StudentProjectExperiencesExperiencesSection.vue'

describe('studentProjectExperiencesExperiencesSection', () => {
  describe('given an experiences section component', () => {
    let wrapper: ReturnType<typeof mount<typeof StudentProjectExperiencesExperiencesSection>>

    beforeEach(() => {
      wrapper = mount<typeof StudentProjectExperiencesExperiencesSection>(StudentProjectExperiencesExperiencesSection)
    })

    describe('when the experiences section is mounted', () => {
      it('then it should render the experiences title', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.exists()).toBe(true)
        expect(titleElement.text()).toBe('Mes expériences')
      })

      it('then it should have the correct CSS class', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.classes()).toContain('b1-bold')
      })
    })
  })
})
