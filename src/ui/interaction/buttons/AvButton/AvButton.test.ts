import type { DsfrButtonProps } from '@gouvminint/vue-dsfr'
import { MDI_ICONS } from '@/ui'
import AvButton from '@/ui/interaction/buttons/AvButton/AvButton.vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

describe('avButton', () => {
  it('should render with default props', () => {
    const wrapper = mount(AvButton)
    const btn = wrapper.getComponent({ name: 'DsfrButton' })

    expect(wrapper.findComponent({ name: 'DsfrButton' }).exists()).toBe(true)
    expect(btn.props('secondary')).toBe(false)
    expect(btn.props('tertiary')).toBe(true)
    expect(btn.props('noOutline')).toBe(true)
    expect(btn.props('size')).toBe('md')
    expect(btn.props('disabled')).toBe(false)
    expect(btn.props('icon')).toBe(undefined)
  })

  it('should render with provided props', () => {
    const props = {
      label: 'Click me',
      variant: 'OUTLINED' as const,
      size: 'lg' as const,
      icon: { name: 'test-icon' },
      disabled: true,
    }

    const wrapper = mount(AvButton, { props })
    const btn = wrapper.getComponent({ name: 'DsfrButton' })

    expect(btn.props('label')).toBe('Click me')
    expect(btn.props('secondary')).toBe(false)
    expect(btn.props('size')).toBe('lg')
    expect(btn.props('icon')).toEqual({ name: 'test-icon' })
    expect(btn.props('disabled')).toBe(true)
    expect(btn.props('tertiary')).toBe(true)
    expect(btn.props('noOutline')).toBe(false)
  })

  it('should set icon to loading when isLoading is true', () => {
    const wrapper = mount(AvButton, {
      props: {
        isLoading: true,
        icon: { name: 'other-icon' },
      },
    })

    const btn = wrapper.getComponent({ name: 'DsfrButton' })

    expect(btn.props('icon')).toEqual({ name: MDI_ICONS.LOADING, animation: 'spin' })
  })

  it('should compute variant props correctly', () => {
    const wrapper = mount(AvButton, {
      props: {
        variant: 'DEFAULT',
      },
    })

    const btn = wrapper.getComponent({ name: 'DsfrButton' })

    expect(btn.props('tertiary')).toBe(true)
    expect(btn.props('noOutline')).toBe(true)
  })

  it('should emit click when clicked', async () => {
    const onClick = vi.fn()

    const wrapper = mount(AvButton, {
      props: { onClick },
    })

    const btn = wrapper.getComponent({ name: 'DsfrButton' })
    await btn.trigger('click')

    expect(onClick).toHaveBeenCalled()
  })

  describe('avButton - computedSvgScale', () => {
    it.each([
      ['small', 1],
      ['sm', 1],
      ['medium', 1.5],
      ['md', 1.5],
      ['large', 2],
      ['lg', 2],
      ['', 1.5]
    ] as [DsfrButtonProps['size'], number][])('returns correct scale for size: %s', async (size, expectedScale) => {
      const wrapper = mount<typeof AvButton>(AvButton, {
        props: {
          size,
        },
      })

      expect(wrapper.vm.computedSvgScale).toBe(expectedScale)
    })
  })
})
