import AvIconText from '@/ui/base/AvIconText/AvIconText.vue'
import { MDI_ICONS } from '@/ui/tokens'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('studentDetailedSkillCard.vue', () => {
  const stubs = {
    VIcon: {
      name: 'VIcon',
      props: ['name', 'color'],
      template: '<i class="mock-v-icon" />',
    },
  }

  const baseProps = {
    icon: MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE,
    text: 'test',
  } as const

  const allProps = {
    ...baseProps,
    iconColor: 'var(--icon-color)',
    textColor: 'var(--text-color)',
    typographyClass: 'typography'
  }

  it('should render properly with given and defaults props', async () => {
    const wrapper = mount(AvIconText, {
      props: baseProps,
      global: {
        stubs
      }
    })

    const vicon = wrapper.findComponent({ name: 'VIcon' })
    expect(vicon.exists()).toBe(true)
    expect(vicon.props('name')).toBe(baseProps.icon)
    expect(vicon.props('color')).toBe('var(--text1)')

    const text = wrapper.find('.icon-text--text')
    expect(text.exists()).toBe(true)
    expect(text.text()).toContain(baseProps.text)
    expect(text.classes()).toContain('b2-regular')
  })

  it('should render properly with given props', async () => {
    const wrapper = mount(AvIconText, {
      props: allProps,
      global: {
        stubs
      }
    })

    const vicon = wrapper.findComponent({ name: 'VIcon' })
    expect(vicon.exists()).toBe(true)
    expect(vicon.props('name')).toBe(allProps.icon)
    expect(vicon.props('color')).toBe(allProps.iconColor)

    const text = wrapper.find('.icon-text--text')
    expect(text.exists()).toBe(true)
    expect(text.text()).toContain(allProps.text)
    expect(text.classes()).toContain(allProps.typographyClass)
  })
})
