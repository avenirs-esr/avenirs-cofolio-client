import AvPopover from '@/ui/overlay/popovers/AvPopover/AvPopover.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type ComponentPublicInstance, h } from 'vue'

vi.mock('focus-trap-vue', () => ({
  FocusTrap: {
    name: 'FocusTrap',
    template: '<div><slot /></div>'
  }
}))

describe('avPopover', () => {
  let wrapper: ReturnType<typeof mount<typeof AvPopover>>

  const mountComponent = (popoverSlot?: () => ReturnType<typeof h>) => {
    wrapper = mount<typeof AvPopover>(AvPopover, {
      global: {
        stubs: {
          teleport: true,
        }
      },
      slots: {
        trigger: ({ toggle }) => h('button', { class: 'trigger', onClick: toggle }, 'Open'),
        popover: popoverSlot ?? (() => h('div', { class: 'popover-content' }, [
          h('button', { autofocus: true }, 'Focusable') // optionnel si besoin de noeud focusable
        ]))
      },
      attachTo: document.body
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    beforeEach(async () => {
      mountComponent()
      await flushPromises()
    })

    it('should not display the popover by default', () => {
      expect(wrapper.find('.av-popover').exists()).toBe(false)
    })
  })

  describe('trigger behavior', () => {
    beforeEach(async () => {
      mountComponent()
      await flushPromises()
    })

    it('should display the popover when the trigger is clicked', async () => {
      await wrapper.find('.trigger').trigger('click')
      await flushPromises()

      expect(wrapper.find('.av-popover').exists()).toBe(true)
    })

    it('should render the FocusTrap wrapper when popover is displayed', async () => {
      await wrapper.find('.trigger').trigger('click')
      await flushPromises()

      expect(wrapper.findComponent({ name: 'FocusTrap' }).exists()).toBe(true)
    })

    it('should close the popover when pressing Escape', async () => {
      await wrapper.find('.trigger').trigger('click')
      await flushPromises()

      await wrapper.find('.av-popover').trigger('keydown', { key: 'Escape' })
      await flushPromises()

      expect(wrapper.find('.av-popover').exists()).toBe(false)
    })
  })

  describe('unmount behavior', () => {
    it('should unmount without error', async () => {
      mountComponent()
      await flushPromises()

      await wrapper.find('.trigger').trigger('click')
      await flushPromises()

      expect(() => wrapper.unmount()).not.toThrow()
    })
  })

  describe('triggerRef handling', () => {
    beforeEach(async () => {
      mountComponent()
      await flushPromises()
    })

    it('should handle null ref', () => {
      wrapper.vm.setTriggerRef(null)
      expect(wrapper.vm.triggerRef).toBe(null)
    })

    it('should handle native HTML element', () => {
      const buttonElement = document.createElement('button')
      wrapper.vm.setTriggerRef(buttonElement)
      expect(wrapper.vm.triggerRef).toBe(buttonElement)
    })

    it('should handle Vue component with $el as HTMLElement', () => {
      const htmlElement = document.createElement('button')
      const fakeVueComponent = { $el: htmlElement } as unknown as ComponentPublicInstance
      wrapper.vm.setTriggerRef(fakeVueComponent)
      expect(wrapper.vm.triggerRef).toBe(htmlElement)
    })

    it('should handle Vue component with $el as null', () => {
      const fakeVueComponent = { $el: null } as unknown as ComponentPublicInstance
      wrapper.vm.setTriggerRef(fakeVueComponent)
      expect(wrapper.vm.triggerRef).toBe(null)
    })
  })
})
