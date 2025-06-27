import AvPopover from '@/ui/overlay/popovers/AvPopover/AvPopover.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type ComponentPublicInstance, h } from 'vue'

const initializeFocusTrapMock = vi.fn()
const cleanupFocusTrapMock = vi.fn()

vi.mock('@/common/composables/use-focus-trap/use-focus-trap', () => ({
  useFocusTrap: () => ({
    initializeFocusTrap: initializeFocusTrapMock,
    cleanupFocusTrap: cleanupFocusTrapMock
  })
}))

describe('given AvPopover component with mocked useFocusTrap', () => {
  let wrapper: ReturnType<typeof mount<typeof AvPopover>>

  const mountComponent = (slots = {}) => {
    wrapper = mount(AvPopover, {
      global: {
        stubs: {
          teleport: {
            props: ['to'],
            render () {
              return this.$slots.default()
            }
          }
        }
      },
      slots: {
        trigger: ({ toggle }) => h('button', { class: 'trigger', onClick: toggle }, 'Open'),
        popover: () => h('div', { class: 'popover-content' }, [h('button', 'Focusable')]),
        ...slots
      },
      attachTo: document.body
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when in initial state', () => {
    beforeEach(() => {
      mountComponent()
    })

    it('then it should not display the popover by default', () => {
      expect(wrapper.find('.av-popover').exists()).toBe(false)
      expect(initializeFocusTrapMock).not.toHaveBeenCalled()
      expect(cleanupFocusTrapMock).not.toHaveBeenCalled()
    })
  })

  describe('when trigger is clicked', () => {
    beforeEach(async () => {
      mountComponent()
      await wrapper.find('.trigger').trigger('click')
      await wrapper.vm.$nextTick()
      await flushPromises()
    })

    it('then it should display the popover', () => {
      expect(wrapper.find('.av-popover').exists()).toBe(true)
    })

    it('then it should call initializeFocusTrap', () => {
      expect(initializeFocusTrapMock).toHaveBeenCalled()
    })

    describe('when Escape key pressed', () => {
      beforeEach(async () => {
        await wrapper.find('.av-popover').trigger('keydown', { key: 'Escape' })
        await wrapper.vm.$nextTick()
      })

      it('then it should close the popover', () => {
        expect(wrapper.find('.av-popover').exists()).toBe(false)
      })

      it('then it should call cleanupFocusTrap', () => {
        expect(cleanupFocusTrapMock).toHaveBeenCalled()
      })
    })
  })

  describe('when popover is opened with no focusable elements', () => {
    beforeEach(async () => {
      mountComponent({
        popover: () => h('div', { class: 'popover-content' })
      })
      await wrapper.find('.trigger').trigger('click')
      await wrapper.vm.$nextTick()
    })

    it('then it should display the popover', () => {
      expect(wrapper.find('.av-popover').exists()).toBe(true)
    })

    it('then it should still call initializeFocusTrap (mocked)', () => {
      expect(initializeFocusTrapMock).toHaveBeenCalled()
    })
  })

  describe('when the component is unmounted', () => {
    beforeEach(async () => {
      mountComponent()
      await wrapper.find('.trigger').trigger('click')
      await wrapper.vm.$nextTick()
      await flushPromises()
      wrapper.unmount()
    })

    it('then it should call cleanupFocusTrap', () => {
      expect(cleanupFocusTrapMock).toHaveBeenCalled()
    })
  })

  describe('when using setTriggerRef method', () => {
    beforeEach(() => {
      mountComponent()
    })

    it('then it should set triggerRef to null if passed null', () => {
      wrapper.vm.setTriggerRef(null)
      expect(wrapper.vm.triggerRef).toBe(null)
    })

    it('then it should set triggerRef to native HTMLElement', () => {
      const el = document.createElement('button')
      wrapper.vm.setTriggerRef(el)
      expect(wrapper.vm.triggerRef).toBe(el)
    })

    it('then it should set triggerRef to Vue component $el if HTMLElement', () => {
      const el = document.createElement('button')
      const fakeComponent = { $el: el } as unknown as ComponentPublicInstance
      wrapper.vm.setTriggerRef(fakeComponent)
      expect(wrapper.vm.triggerRef).toBe(el)
    })

    it('then it should set triggerRef to null if Vue component $el is null', () => {
      const fakeComponent = { $el: null } as unknown as ComponentPublicInstance
      wrapper.vm.setTriggerRef(fakeComponent)
      expect(wrapper.vm.triggerRef).toBe(null)
    })
  })
})
