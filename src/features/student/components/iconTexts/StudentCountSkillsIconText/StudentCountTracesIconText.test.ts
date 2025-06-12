import { mount } from '@vue/test-utils'
import { describe, it } from 'vitest'
import StudentCountSkillsIconText from './StudentCountSkillsIconText.vue'

describe('studentCountSkillsIconText', () => {
  const stubs = {
    AvIconText: {
      name: 'AvIconText',
      template: `<div class="av-icon-text" />`,
      props: ['text']
    },
  }

  it('should render none version of text when countSkills equals 0', () => {
    const wrapper = mount(StudentCountSkillsIconText, {
      props: { countSkills: 0 },
      global: {
        stubs
      }
    })

    const iconText = wrapper.findComponent({ name: 'AvIconText' })
    expect(iconText.exists()).toBe(true)
    expect(iconText.props('text')).toContain('0 compétence')
  })

  it('should render singular version of text when countSkills equals 1', () => {
    const wrapper = mount(StudentCountSkillsIconText, {
      props: { countSkills: 1 },
      global: {
        stubs
      }
    })

    const iconText = wrapper.findComponent({ name: 'AvIconText' })
    expect(iconText.exists()).toBe(true)
    expect(iconText.props('text')).toContain('1 compétence')
  })

  it('should render plural version of text when countSkills is greater than 1', () => {
    const wrapper = mount(StudentCountSkillsIconText, {
      props: { countSkills: 2 },
      global: {
        stubs
      }
    })

    const iconText = wrapper.findComponent({ name: 'AvIconText' })
    expect(iconText.exists()).toBe(true)
    expect(iconText.props('text')).toContain('2 compétences')
  })
})
