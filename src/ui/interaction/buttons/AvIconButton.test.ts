import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import AvIconButton from './AvIconButton.vue'

describe('avIconButton', () => {
  it('renders correctly with required props', () => {
    const wrapper = mount(AvIconButton, {
      props: {
        icon: 'mdi-account',
        label: 'User',
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'AvButton' }).exists()).toBe(true)
  })

  it('passes icon-only prop to AvButton', () => {
    const wrapper = mount(AvIconButton, {
      props: {
        icon: 'mdi-settings',
      },
    })

    const avButton = wrapper.findComponent({ name: 'AvButton' })
    expect(avButton.props('iconOnly')).toBe(true)
  })

  it('disables the button when disabled is true', () => {
    const wrapper = mount(AvIconButton, {
      props: {
        icon: 'mdi-lock',
        disabled: true,
      },
    })
    const avButton = wrapper.findComponent({ name: 'AvButton' })
    expect(avButton.props('disabled')).toBe(true)
  })

  it('emits click when clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(AvIconButton, {
      props: {
        icon: 'mdi-home',
        onClick,
      },
    })

    await wrapper.trigger('click')

    expect(onClick).toHaveBeenCalled()
  })
})
