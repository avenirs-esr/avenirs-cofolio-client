import { MDI_ICONS } from '@/ui/tokens'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import IconText from './IconText.vue'

describe('studentDetailedSkillCard.vue', () => {
  const stubs = {
    VIcon: {
      name: 'VIcon',
      props: ['name', 'color'],
      template: '<i class="mock-v-icon" />',
    },
  }

  const baseProps = {
    icon: MDI_ICONS.ACCOUNT_CIRCLE,
    text: 'test',
  } as const

  const allProps = {
    ...baseProps,
    color: '--color',
    typographyClass: 'typography'
  }

  it('should render properly with given and defaults props', async () => {
    const wrapper = mount(IconText, {
      props: baseProps,
      global: {
        stubs
      }
    })

    const vicon = wrapper.findComponent({ name: 'VIcon' })
    expect(vicon.exists()).toBe(true)
    expect(vicon.props('name')).toBe(baseProps.icon)
    expect(vicon.props('color')).toBe('var(--foreground-text1)')

    const text = wrapper.find('.icon-text--text')
    expect(text.exists()).toBe(true)
    expect(text.text()).toContain(baseProps.text)
    expect(text.classes()).toContain('b2-regular')
  })

  it('should render properly with given props', async () => {
    const wrapper = mount(IconText, {
      props: allProps,
      global: {
        stubs
      }
    })

    const vicon = wrapper.findComponent({ name: 'VIcon' })
    expect(vicon.exists()).toBe(true)
    expect(vicon.props('name')).toBe(allProps.icon)
    expect(vicon.props('color')).toBe(`var(${allProps.color})`)

    const text = wrapper.find('.icon-text--text')
    expect(text.exists()).toBe(true)
    expect(text.text()).toContain(allProps.text)
    expect(text.classes()).toContain(allProps.typographyClass)
  })
})
