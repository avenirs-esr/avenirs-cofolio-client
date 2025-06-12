import { mount } from '@vue/test-utils'
import { describe, it } from 'vitest'
import StudentCountTracesIconText from './StudentCountTracesIconText.vue'

describe('studentCountTracesIconText', () => {
  const stubs = {
    AvIconText: {
      name: 'AvIconText',
      template: `<div class="av-icon-text" />`,
      props: ['text']
    },
  }

  it('should render none version of text when countTraces equals 0', () => {
    const wrapper = mount(StudentCountTracesIconText, {
      props: { countTraces: 0 },
      global: {
        stubs
      }
    })

    const iconText = wrapper.findComponent({ name: 'AvIconText' })
    expect(iconText.exists()).toBe(true)
    expect(iconText.props('text')).toContain('0 trace')
  })

  it('should render singular version of text when countTraces equals 1', () => {
    const wrapper = mount(StudentCountTracesIconText, {
      props: { countTraces: 1 },
      global: {
        stubs
      }
    })

    const iconText = wrapper.findComponent({ name: 'AvIconText' })
    expect(iconText.exists()).toBe(true)
    expect(iconText.props('text')).toContain('1 trace')
  })

  it('should render plural version of text when countTraces is greater than 1', () => {
    const wrapper = mount(StudentCountTracesIconText, {
      props: { countTraces: 2 },
      global: {
        stubs
      }
    })

    const iconText = wrapper.findComponent({ name: 'AvIconText' })
    expect(iconText.exists()).toBe(true)
    expect(iconText.props('text')).toContain('2 traces')
  })
})
