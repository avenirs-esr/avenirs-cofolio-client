import { mount } from '@vue/test-utils'
import { describe, it } from 'vitest'
import StudentCountAmsIconText from './StudentCountAmsIconText.vue'

describe('studentCountAmsIconText', () => {
  const stubs = {
    AvIconText: {
      name: 'AvIconText',
      template: `<div class="av-icon-text" />`,
      props: ['text']
    },
  }

  it('should render none version of text when countAms equals 0', () => {
    const wrapper = mount(StudentCountAmsIconText, {
      props: { countAms: 0 },
      global: {
        stubs
      }
    })

    const iconText = wrapper.findComponent({ name: 'AvIconText' })
    expect(iconText.exists()).toBe(true)
    expect(iconText.props('text')).toContain('0 mise en situation')
  })

  it('should render singular version of text when countAms equals 1', () => {
    const wrapper = mount(StudentCountAmsIconText, {
      props: { countAms: 1 },
      global: {
        stubs
      }
    })

    const iconText = wrapper.findComponent({ name: 'AvIconText' })
    expect(iconText.exists()).toBe(true)
    expect(iconText.props('text')).toContain('1 mise en situation')
  })

  it('should render plural version of text when countAms is greater than 1', () => {
    const wrapper = mount(StudentCountAmsIconText, {
      props: { countAms: 2 },
      global: {
        stubs
      }
    })

    const iconText = wrapper.findComponent({ name: 'AvIconText' })
    expect(iconText.exists()).toBe(true)
    expect(iconText.props('text')).toContain('2 mises en situation')
  })
})
