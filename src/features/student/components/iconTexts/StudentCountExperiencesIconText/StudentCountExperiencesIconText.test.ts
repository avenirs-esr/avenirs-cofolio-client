import StudentCountExperiencesIconText
  from '@/features/student/components/iconTexts/StudentCountExperiencesIconText/StudentCountExperiencesIconText.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

function createWrapper (props = { countExperiences: 3 }) {
  return mount(StudentCountExperiencesIconText, {
    props,
    global: {
      stubs: {
        AvIconText: {
          name: 'AvIconText',
          props: ['icon', 'text', 'gap', 'iconColor', 'textColor', 'typographyClass'],
          template: `<div class="mock-icon-text">{{ text }}</div>`
        }
      }
    }
  })
}

describe('given a student count additional experiences icon text', () => {
  describe('when the component is mounted', () => {
    it('then it should render the text with count', () => {
      const wrapper = createWrapper({ countExperiences: 5 })
      expect(wrapper.text()).toContain('5 expériences')
    })

    it('then it should render with default gap if not provided', () => {
      const wrapper = createWrapper({ countExperiences: 1 })
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.props('gap')).toBe('var(--spacing-xs)')
    })

    it('then it should use correct icon', () => {
      const wrapper = createWrapper({ countExperiences: 4 })
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.props('icon')).toBe('mdi:electron-framework')
    })

    it('then it should apply the correct text and icon colors', () => {
      const wrapper = createWrapper({ countExperiences: 4 })
      const iconText = wrapper.findComponent({ name: 'AvIconText' })
      expect(iconText.props('iconColor')).toBe('var(--text1)')
      expect(iconText.props('textColor')).toBe('var(--text1)')
    })
  })
})
