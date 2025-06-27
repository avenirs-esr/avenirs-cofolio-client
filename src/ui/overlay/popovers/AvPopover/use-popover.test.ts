import { usePopover } from '@/ui/overlay/popovers/AvPopover/use-popover'
import { mountComposable } from 'tests/utils'
import { beforeEach, describe, expect, it, type MockInstance, vi } from 'vitest'
import { nextTick, type Ref } from 'vue'

describe('usePopover', () => {
  let addEventListenerSpy: MockInstance
  let removeEventListenerSpy: MockInstance
  let unmount: () => void

  beforeEach(() => {
    vi.clearAllMocks()
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')
  })

  describe('given a fresh popover instance', () => {
    let triggerRef: Ref<HTMLElement | null>
    let popoverRef: Ref<HTMLElement | null>
    let usePopoverResult: ReturnType<typeof usePopover>

    beforeEach(() => {
      popoverRef = ref(null)
      triggerRef = ref(null)
      const mountComposableResult = mountComposable(() => usePopover(triggerRef, popoverRef), {})
      usePopoverResult = mountComposableResult.result
      unmount = mountComposableResult.unmount
    })

    it('then the popover should be hidden by default', () => {
      expect(usePopoverResult.showPopover.value).toBe(false)
    })

    it('then the popover position should be initialized to (0,0)', () => {
      expect(usePopoverResult.popoverPosition.value).toEqual({ top: 0, left: 0 })
    })

    it('then document click listener should be registered', () => {
      expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
    })

    describe('when the popover is toggled open without trigger ref', () => {
      beforeEach(async () => {
        await usePopoverResult.togglePopover()
      })

      it('then the popover should be visible', () => {
        expect(usePopoverResult.showPopover.value).toBe(true)
      })

      it('then the popover position should remain unchanged', () => {
        expect(usePopoverResult.popoverPosition.value).toEqual({ top: 0, left: 0 })
      })
    })

    describe('when the popover is toggled open with trigger ref', () => {
      beforeEach(async () => {
        triggerRef.value = document.createElement('button')
        popoverRef.value = document.createElement('div')

        vi.spyOn(triggerRef.value, 'getBoundingClientRect').mockReturnValue({
          top: 50,
          left: 100,
          bottom: 100,
          right: 150,
          width: 50,
          height: 50,
          x: 0,
          y: 0,
          toJSON: () => ''
        })

        vi.spyOn(popoverRef.value, 'getBoundingClientRect').mockReturnValue({
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: 200,
          height: 50,
          x: 0,
          y: 0,
          toJSON: () => ''
        })

        await usePopoverResult.togglePopover()
        await nextTick()
      })

      it('then the popover should be visible', () => {
        expect(usePopoverResult.showPopover.value).toBe(true)
      })

      it('then the popover position should be updated based on trigger position', () => {
        expect(usePopoverResult.popoverPosition.value).toEqual({
          top: 100 + window.scrollY,
          left: 100 + window.scrollX
        })
      })
    })

    describe('when the popover would overflow the viewport', () => {
      beforeEach(async () => {
        triggerRef.value = document.createElement('button')
        popoverRef.value = document.createElement('div')

        vi.spyOn(triggerRef.value, 'getBoundingClientRect').mockReturnValue({
          top: 50,
          left: 1000,
          bottom: 100,
          right: 1050,
          width: 50,
          height: 50,
          x: 0,
          y: 0,
          toJSON: () => ''
        })

        vi.spyOn(popoverRef.value, 'getBoundingClientRect').mockReturnValue({
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: 300,
          height: 50,
          x: 0,
          y: 0,
          toJSON: () => ''
        })

        vi.stubGlobal('innerWidth', 1200)

        await usePopoverResult.togglePopover()
        await nextTick()
      })

      it('then the popover should reposition to stay inside viewport', () => {
        expect(usePopoverResult.popoverPosition.value.left).toBe(1200 - 300 - 16)
      })
    })

    describe('when the popover would overflow completely on the left', () => {
      beforeEach(async () => {
        triggerRef.value = document.createElement('button')
        popoverRef.value = document.createElement('div')

        vi.spyOn(triggerRef.value, 'getBoundingClientRect').mockReturnValue({
          top: 50,
          left: 10,
          bottom: 100,
          right: 60,
          width: 50,
          height: 50,
          x: 0,
          y: 0,
          toJSON: () => ''
        })

        vi.spyOn(popoverRef.value, 'getBoundingClientRect').mockReturnValue({
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          width: 600,
          height: 50,
          x: 0,
          y: 0,
          toJSON: () => ''
        })

        vi.stubGlobal('innerWidth', 500)

        await usePopoverResult.togglePopover()
        await nextTick()
      })

      it('then the popover should reposition to minimum margin if left is negative', () => {
        expect(usePopoverResult.popoverPosition.value.left).toBe(16)
      })
    })

    describe('when closePopover is called', () => {
      beforeEach(() => {
        usePopoverResult.showPopover.value = true
        usePopoverResult.closePopover()
      })

      it('then the popover should be hidden', () => {
        expect(usePopoverResult.showPopover.value).toBe(false)
      })
    })

    describe('when a click outside the trigger is detected', () => {
      beforeEach(() => {
        usePopoverResult.showPopover.value = true
        const outsideElement = document.createElement('div')
        const clickEvent = new MouseEvent('click', { bubbles: true })
        Object.defineProperty(clickEvent, 'target', { value: outsideElement })

        const handler = addEventListenerSpy.mock.calls.find(call => call[0] === 'click')?.[1] as EventListener
        handler?.(clickEvent)
      })

      it('then the popover should be closed', async () => {
        await usePopoverResult.togglePopover()

        const triggerElement = document.createElement('div')
        triggerRef.value = triggerElement
        document.body.appendChild(triggerElement)

        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          composed: true
        })
        Object.defineProperty(clickEvent, 'target', { value: document.body })

        document.dispatchEvent(clickEvent)

        await nextTick()

        expect(usePopoverResult.showPopover.value).toBe(false)

        document.body.removeChild(triggerElement)
      })
    })

    describe('when a click inside the trigger is detected', () => {
      beforeEach(() => {
        const triggerElement = document.createElement('button')
        triggerRef.value = triggerElement

        const clickEvent = new MouseEvent('click', { bubbles: true })
        Object.defineProperty(clickEvent, 'target', { value: triggerElement })

        const handler = addEventListenerSpy.mock.calls.find(call => call[0] === 'click')?.[1] as EventListener
        handler?.(clickEvent)
      })

      it('then the popover should remain unchanged', () => {
        expect(usePopoverResult.showPopover.value).toBe(false)
      })
    })

    describe('when the component is unmounted', () => {
      it('then the click listener should be removed', () => {
        unmount()
        expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
      })
    })
  })
})
