import { mount } from '@vue/test-utils'
import { describe, it } from 'vitest'
import AvBadge from './AvBadge.vue'

describe('avBadge', () => {
  const defaultProps = {
    color: 'var(--color)',
    backgroundColor: 'var(--background-color)',
    label: 'MyBadge'
  }
  const propsWithIconPath = { ...defaultProps, iconPath: '/assets/icons/icon.svg' }

  it('should render with given properties', () => {
    const wrapper = mount(AvBadge, {
      props: defaultProps,
      global: {
        stubs: {
          DsfrBadge: {
            name: 'DsfrBadge',
            template: `<div class="dsfr-badge" />`,
            props: ['label', 'type'],
          },
        }
      }
    })

    const dsfrBadge = wrapper.findComponent({ name: 'DsfrBadge' })

    expect(dsfrBadge.exists()).toBe(true)
    expect(dsfrBadge.props()).toMatchObject({
      label: defaultProps.label,
      type: undefined,
    })

    expect(dsfrBadge.classes()).not.toContain('av-badge--customIcon')
  })

  it('should add specific class when given iconPath', () => {
    const wrapper = mount(AvBadge, {
      props: propsWithIconPath,
      global: {
        stubs: {
          DsfrBadge: {
            name: 'DsfrBadge',
            template: `<div class="dsfr-badge" />`,
            props: ['label', 'type'],
          },
        }
      }
    })

    const dsfrBadge = wrapper.findComponent({ name: 'DsfrBadge' })

    expect(dsfrBadge.exists()).toBe(true)
    expect(dsfrBadge.props()).toMatchObject({
      label: defaultProps.label,
      type: undefined,
    })

    expect(dsfrBadge.classes()).toContain('av-badge--customIcon')
  })
})
