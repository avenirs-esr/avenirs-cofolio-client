import AvPopover from '@/ui/overlay/popovers/AvPopover/AvPopover.vue'
import { flushPromises, mount } from '@vue/test-utils'
import { createFocusTrap } from 'focus-trap'
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest'
import { h } from 'vue'

vi.mock('focus-trap', () => ({
  createFocusTrap: vi.fn(() => ({
    activate: vi.fn(),
    deactivate: vi.fn()
  }))
}))

describe('avPopover', () => {
  let wrapper: ReturnType<typeof mount>

  const mountComponent = () => {
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
})
