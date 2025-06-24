import AvTab from '@/ui/interaction/tabs/AvTab/AvTab.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

describe('avTab', () => {
  const slots = {
    default: '<div class="slot-content">Slot Content</div>',
  }

  describe('given a component with required props', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(AvTab, {
        props: {
          title: 'Test Title',
        },
        slots,
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the slot content', () => {
        expect(wrapper.find('.slot-content').exists()).toBe(true)
        expect(wrapper.find('.slot-content').text()).toBe('Slot Content')
      })
    })
  })

  describe('given a component with optional icon prop', () => {
    let wrapper: VueWrapper
    const props = {
      title: 'Test Title',
      icon: 'test-icon',
    }

    beforeEach(() => {
      wrapper = mount(AvTab, {
        props,
        slots,
      })
    })

    describe('when the component is mounted', () => {
      it('then it should accept the icon prop without error', () => {
        expect(wrapper.props()).toMatchObject(props)
      })
    })
  })
})
