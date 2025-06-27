import AvPopover from '@/ui/overlay/popovers/AvPopover/AvPopover.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { createFocusTrap } from 'focus-trap'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { type ComponentPublicInstance, h } from 'vue'

vi.mock('focus-trap', () => ({
  createFocusTrap: vi.fn(() => ({
    activate: vi.fn(),
    deactivate: vi.fn()
  }))
}))

describe('avPopover', () => {
  let wrapper: ReturnType<typeof mount<typeof AvPopover>>

  const mountComponent = () => {
    wrapper = mount<typeof AvPopover>(AvPopover, {
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
        popover: () => h('div', { class: 'popover-content' }, [h('button', 'Focusable')])
      },
      attachTo: document.body
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('given a fresh popover instance', () => {
    beforeEach(() => {
      mountComponent()
    })

    it('then it should not display the popover by default', () => {
      expect(wrapper.find('.av-popover').exists()).toBe(false)
    })
  })

  describe('given the popover trigger is rendered', () => {
    beforeEach(() => {
      mountComponent()
    })

    describe('when the trigger is clicked', () => {
      beforeEach(async () => {
        await wrapper.find('.trigger').trigger('click')
        await wrapper.vm.$nextTick()
        await flushPromises()
      })

      it('then the popover should be displayed', () => {
        expect(wrapper.find('.av-popover').exists()).toBe(true)
      })

      it('then focus trap should be activated', () => {
        const focusTrapInstance = (createFocusTrap as Mock).mock.results[0].value
        expect(focusTrapInstance.activate).toHaveBeenCalled()
      })

      describe('when the Escape key is pressed', () => {
        beforeEach(async () => {
          await wrapper.find('.av-popover').trigger('keydown', { key: 'Escape' })
        })

        it('then the popover should be closed', () => {
          expect(wrapper.find('.av-popover').exists()).toBe(false)
        })

        it('then focus trap should be deactivated', () => {
          const focusTrapInstance = (createFocusTrap as Mock).mock.results[0].value
          expect(focusTrapInstance.deactivate).toHaveBeenCalled()
        })
      })
    })

    describe('when the popover is opened with no focusable elements', () => {
      beforeEach(async () => {
        wrapper = mount<typeof AvPopover>(AvPopover, {
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
            popover: () => h('div', { class: 'popover-content' })
          },
          attachTo: document.body
        })

        await wrapper.find('.trigger').trigger('click')
        await wrapper.vm.$nextTick()
      })

      it('then the focus trap should not be activated', () => {
        expect(createFocusTrap).not.toHaveBeenCalled()
      })
    })

    describe('when the focus trap is deactivated', () => {
      beforeEach(async () => {
        await wrapper.find('.trigger').trigger('click')
        await wrapper.vm.$nextTick()

        const focusTrapOptions = (createFocusTrap as Mock).mock.calls[0][1]
        focusTrapOptions.onDeactivate()
        await wrapper.vm.$nextTick()
      })

      it('then the popover should be closed', () => {
        expect(wrapper.find('.av-popover').exists()).toBe(false)
      })
    })
  })

  describe('given the popover is opened', () => {
    beforeEach(async () => {
      mountComponent()
      await wrapper.find('.trigger').trigger('click')
      await wrapper.vm.$nextTick()
      await flushPromises()
    })

    describe('when the component is unmounted', () => {
      it('then the focus trap should be deactivated', () => {
        wrapper.unmount()
        const focusTrapInstance = (createFocusTrap as Mock).mock.results[0].value
        expect(focusTrapInstance.deactivate).toHaveBeenCalled()
      })
    })
  })

  describe('given the trigger ref is unset (el is null)', () => {
    beforeEach(() => {
      mountComponent()
      wrapper.vm.setTriggerRef(null)
    })

    it('then the trigger ref should be null', () => {
      expect(wrapper.vm.triggerRef).toBe(null)
    })
  })

  describe('given the trigger ref is a native HTML element', () => {
    const buttonElement = document.createElement('button')

    beforeEach(() => {
      mountComponent()
      wrapper.vm.setTriggerRef(buttonElement)
    })

    it('then the trigger ref should be set to the element', () => {
      expect(wrapper.vm.triggerRef).toBe(buttonElement)
    })
  })

  describe('given the trigger ref is a Vue component with $el as HTMLElement', () => {
    const htmlElement = document.createElement('button')
    const fakeVueComponent = { $el: htmlElement } as unknown as ComponentPublicInstance

    beforeEach(() => {
      mountComponent()
      wrapper.vm.setTriggerRef(fakeVueComponent)
    })

    it('then the trigger ref should be set to the $el element', () => {
      expect(wrapper.vm.triggerRef).toBe(htmlElement)
    })
  })

  describe('given the trigger ref is a Vue component with $el as non-HTMLElement', () => {
    const fakeVueComponent = { $el: null } as unknown as ComponentPublicInstance

    beforeEach(() => {
      mountComponent()
      wrapper.vm.setTriggerRef(fakeVueComponent)
    })

    it('then the trigger ref should be null', () => {
      expect(wrapper.vm.triggerRef).toBe(null)
    })
  })
})
