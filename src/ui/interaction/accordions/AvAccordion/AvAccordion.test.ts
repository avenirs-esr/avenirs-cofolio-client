import AvAccordion from '@/ui/interaction/accordions/AvAccordion/AvAccordion.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

describe('avAccordion', () => {
  const slots = {
    default: '<div class="slot-content">Slot Content</div>',
  }

  describe('given an accordion with required props', () => {
    let wrapper: VueWrapper<InstanceType<typeof AvAccordion>>

    beforeEach(() => {
      wrapper = mount(AvAccordion, {
        props: {
          title: 'Test Title',
        },
        slots,
      })
    })

    describe('when the accordion is mounted', () => {
      it('then it should render the slot content', () => {
        expect(wrapper.find('.slot-content').exists()).toBe(true)
        expect(wrapper.find('.slot-content').text()).toBe('Slot Content')
      })
    })
  })

  describe('given an accordion with optional icon prop', () => {
    let wrapper: VueWrapper
    const props = {
      title: 'Test Title',
      icon: 'test-icon',
    }

    beforeEach(() => {
      wrapper = mount(AvAccordion, {
        props,
        slots,
      })
    })

    describe('when the accordion is mounted', () => {
      it('then it should accept the icon prop without error', () => {
        expect(wrapper.props()).toMatchObject(props)
      })
    })
  })
})
