import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import StudentProjectExperiencesCareersSection from './StudentProjectExperiencesCareersSection.vue'

describe('studentProjectExperiencesCareersSection', () => {
  describe('given a careers section component', () => {
    let wrapper: ReturnType<typeof mount<typeof StudentProjectExperiencesCareersSection>>

    beforeEach(() => {
      wrapper = mount<typeof StudentProjectExperiencesCareersSection>(StudentProjectExperiencesCareersSection)
    })

    describe('when the careers section is mounted', () => {
      it('then it should render the careers title', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.exists()).toBe(true)
        expect(titleElement.text()).toBe('Mon parcours')
      })

      it('then it should have the correct CSS class', () => {
        const titleElement = wrapper.find('.b1-bold')
        expect(titleElement.classes()).toContain('b1-bold')
      })
    })
  })
})
