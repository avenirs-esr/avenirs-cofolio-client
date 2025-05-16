import { VIcon } from '@gouvminint/vue-dsfr'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import AvRichButton from './AvRichButton.vue'

describe('avRichButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(AvRichButton, {
      slots: {
        default: 'Click me'
      }
    })
    expect(wrapper.text()).toContain('Click me')
  })

  it('renders iconLeft when provided', () => {
    const wrapper = mount(AvRichButton, {
      props: {
        iconLeft: 'mdi-home',
        onClick: () => {}
      },
      global: {
        components: { VIcon }
      }
    })
    expect(wrapper.findComponent(VIcon).exists()).toBe(true)
    expect(wrapper.findComponent(VIcon).props().name).toBe('mdi-home')
  })

  it('renders iconRight when provided', () => {
    const wrapper = mount(AvRichButton, {
      props: {
        iconRight: 'mdi-arrow-right',
        onClick: () => {}
      },
      global: {
        components: { VIcon }
      }
    })
    const icons = wrapper.findAllComponents(VIcon)
    expect(icons.length).toBe(1)
    expect(icons[0].props().name).toBe('mdi-arrow-right')
  })

  it('calls onClick when button is clicked', async () => {
    const onClick = vi.fn()
    const wrapper = mount(AvRichButton, {
      props: { onClick }
    })

    await wrapper.find('button').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })
})
