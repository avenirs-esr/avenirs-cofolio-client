import AvRadioButton, { type AvRadioButtonProps } from '@/ui/interaction/radios/AvRadioButton/AvRadioButton.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a radio button with required props', () => {
  let wrapper: VueWrapper<InstanceType<typeof AvRadioButton>>

  const slots = {
    default: '<div class="slot-content">Slot Content</div>',
  }

  beforeEach(() => {
    wrapper = mount(AvRadioButton, {
      props: {
        value: 'Test',
      },
      slots,
    })
  })

  BddTest().when('the radio button is mounted', () => {
    BddTest().then('it should render the slot content', () => {
      expect(wrapper.find('.slot-content').exists()).toBe(true)
      expect(wrapper.find('.slot-content').text()).toBe('Slot Content')
    })
  })

  BddTest().and('with optional icon prop', () => {
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

    BddTest().when('the radio button is mounted', () => {
      BddTest().then('it should accept the props without error', () => {
        expect(wrapper.props()).toMatchObject(props)
      })
    })
  })
})
