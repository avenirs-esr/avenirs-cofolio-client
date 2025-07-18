import AvToggle from '@/ui/interaction/toggles/AvToggle/AvToggle.vue'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

describe('avToggle', () => {
  const defaultProps = {
    modelValue: false,
    id: 'my-toggle',
    activeText: 'Yes',
    inactiveText: 'No',
    name: 'status-toggle',
  }

  describe('given a toggle with default props', () => {
    let wrapper: ReturnType<typeof mount<typeof AvToggle>>

    beforeEach(() => {
      wrapper = mount(AvToggle, {
        props: defaultProps,
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the inactive text', () => {
        expect(wrapper.text()).toContain('No')
      })

      it('then it should not render the active text', () => {
        expect(wrapper.text()).not.toContain('Yes')
      })

      it('then the input should be unchecked', () => {
        const input = wrapper.find('input[type="checkbox"]')
        expect((input.element as HTMLInputElement).checked).toBe(false)
      })
    })

    describe('when the toggle is clicked', () => {
      it('then it should emit an update:modelValue event', async () => {
        const input = wrapper.find('input')
        await input.setValue(true)

        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
      })
    })
  })

  describe('given a toggle initially active', () => {
    let wrapper: ReturnType<typeof mount<typeof AvToggle>>

    beforeEach(() => {
      wrapper = mount(AvToggle, {
        props: { ...defaultProps, modelValue: true },
      })
    })

    describe('when the toggle is mounted', () => {
      it('then it should render the active text', () => {
        expect(wrapper.text()).toContain('Yes')
      })

      it('then the input should be checked', () => {
        const input = wrapper.find('input[type="checkbox"]')
        expect((input.element as HTMLInputElement).checked).toBe(true)
      })
    })
  })

  describe('given a toggle disabled', () => {
    let wrapper: ReturnType<typeof mount<typeof AvToggle>>

    beforeEach(() => {
      wrapper = mount(AvToggle, {
        props: { ...defaultProps, disabled: true },
      })
    })

    describe('when the toggle is mounted', () => {
      it('then it should have disabled class and input disabled', () => {
        const label = wrapper.find('label')
        expect(label.classes()).toContain('av-toggle--disabled')

        const input = wrapper.find('input')
        expect(input.attributes('disabled')).toBeDefined()
        expect(input.attributes('aria-disabled')).toBe('true')
      })
    })
  })

  describe('given a toggle without id', () => {
    describe('when the toggle is mounted', () => {
      it('then it should generate a random input id', () => {
        const wrapper = mount(AvToggle)
        const input = wrapper.find('input[type="checkbox"]')
        const inputId = input.attributes('id')
        expect(inputId).toBeDefined()

        const label = wrapper.find('label')
        expect(label.attributes('for')).toBe(inputId)
        expect(label.attributes('id')).toContain(`${inputId}-label`)
      })
    })
  })

  describe('given a toggle with default slot provided', () => {
    let wrapper: ReturnType<typeof mount<typeof AvToggle>>

    beforeEach(() => {
      wrapper = mount(AvToggle, {
        slots: {
          default: '<div class="slot-content">Extra</div>',
        },
      })
    })

    describe('when the toggle is mounted', () => {
      it('then it should render the slot content', () => {
        expect(wrapper.find('.slot-content').text()).toBe('Extra')
      })
    })
  })
})
