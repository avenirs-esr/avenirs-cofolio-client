import AvRichButton from '@/ui/interaction/buttons/AvRichButton/AvRichButton.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('avRichButton', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvRichButton>>

  const props = { label: 'test' }

  const stubs = {
    AvVIcon: {
      name: 'AvVIcon',
      props: ['name', 'color', 'size'],
      template: `<div class="av-vicon" />`,
    },
  }

  describe('given a default rich button', () => {
    beforeEach(() => {
      wrapper = mount<typeof AvRichButton>(AvRichButton, { props, global: { stubs } })
    })

    it('then it should render an empty button', () => {
      expect(wrapper.findAllComponents({ name: 'AvVICon' })).toHaveLength(0)
    })
  })

  describe('given a rich button with a default slot', () => {
    beforeEach(() => {
      wrapper = mount<typeof AvRichButton>(AvRichButton, {
        props,
        slots: { default: 'Click me' },
        global: { stubs }
      })
    })

    it('then it should render the default slot', () => {
      expect(wrapper.text()).toContain('Click me')
    })
  })

  describe('given a rich button with left icon', () => {
    const customProps = {
      ...props,
      iconLeft: 'mdi:home'
    }

    beforeEach(() => {
      wrapper = mount<typeof AvRichButton>(AvRichButton, { props: customProps, global: { stubs } })
    })

    it('then it should render the left icon', () => {
      const leftContainer = wrapper.find('.av-rich-button__left')
      const leftIcon = leftContainer.findComponent({ name: 'AvVIcon' })
      expect(leftIcon.exists()).toBe(true)
      expect(leftIcon.props('name')).toBe(customProps.iconLeft)
    })
  })

  describe('given a rich button with right icon', () => {
    const customProps = {
      ...props,
      iconRight: 'mdi:home'
    }

    beforeEach(() => {
      wrapper = mount<typeof AvRichButton>(AvRichButton, { props: customProps, global: { stubs } })
    })

    it('then it should render the left icon', () => {
      const leftContainer = wrapper.find('.av-rich-button__left')
      const leftIcon = leftContainer.findComponent({ name: 'AvVIcon' })
      expect(leftIcon.exists()).toBe(false)
      const rightIcon = wrapper.findComponent({ name: 'AvVIcon' })
      expect(rightIcon.props('name')).toBe(customProps.iconRight)
    })
  })

  describe('given a rich button with onClick provided', () => {
    const onClick = vi.fn()

    const customProps = {
      ...props,
      onClick
    }

    beforeEach(() => {
      wrapper = mount<typeof AvRichButton>(AvRichButton, { props: customProps, global: { stubs } })
    })

    it('then it should call onClick when button is clicked', async () => {
      await wrapper.find('button').trigger('click')
      expect(onClick).toHaveBeenCalled()
    })
  })
})
