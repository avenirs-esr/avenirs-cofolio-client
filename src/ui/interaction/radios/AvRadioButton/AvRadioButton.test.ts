import AvRadioButton, { type AvRadioButtonProps } from '@/ui/interaction/radios/AvRadioButton/AvRadioButton.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('avRadioButton', () => {
  const slots = {
    default: '<div class="slot-content">Slot Content</div>',
  }

  describe('given a radio button with required props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(AvRadioButton, {
        props: {
          value: 'Test',
        },
        slots,
      })
    })

    describe('when the radio button is mounted', () => {
      it('then it should render the slot content', () => {
        expect(wrapper.find('.slot-content').exists()).toBe(true)
        expect(wrapper.find('.slot-content').text()).toBe('Slot Content')
      })
    })
  })

  describe('given a radio button with optional icon prop', () => {
    let wrapper: VueWrapper
    const props: AvRadioButtonProps = {
      value: 'Test value',
      label: 'Test label',
      description: 'Test description',
      disabled: false,
    }

    beforeEach(() => {
      wrapper = mount(AvRadioButton, {
        props,
        slots,
      })
    })

    describe('when the radio button is mounted', () => {
      it('then it should accept the props without error', () => {
        expect(wrapper.props()).toMatchObject(props)
      })
    })
  })
})
