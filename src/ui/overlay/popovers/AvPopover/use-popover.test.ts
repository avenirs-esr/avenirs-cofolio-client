import { usePopover } from '@/ui/overlay/popovers/AvPopover/use-popover'
import { mountComposable } from '@/ui/tests/utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, type MockInstance, vi } from 'vitest'
import { nextTick, type Ref } from 'vue'

BddTest().given('a fresh popover instance', () => {
  let addEventListenerSpy: MockInstance
  let removeEventListenerSpy: MockInstance
  let unmount: () => void

  let triggerRef: Ref<HTMLElement | null>
  let popoverRef: Ref<HTMLElement | null>
  let usePopoverResult: ReturnType<typeof usePopover>

  beforeEach(() => {
    vi.clearAllMocks()
    addEventListenerSpy = vi.spyOn(document, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    popoverRef = ref(null)
    triggerRef = ref(null)
    const mountComposableResult = mountComposable(() => usePopover(triggerRef, popoverRef), {})
    usePopoverResult = mountComposableResult.result
    unmount = mountComposableResult.unmount
  })

  BddTest().then('the popover should be hidden by default', () => {
    expect(usePopoverResult.showPopover.value).toBe(false)
  })

  BddTest().then('the popover position should be initialized to (0,0)', () => {
    expect(usePopoverResult.popoverPosition.value).toEqual({ top: 0, left: 0 })
  })

  BddTest().then('document click listener should be registered', () => {
    expect(addEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
  })

  BddTest().when('the popover is toggled open without trigger ref', () => {
    beforeEach(async () => {
      await usePopoverResult.togglePopover()
    })

    BddTest().then('the popover should be visible', () => {
      expect(usePopoverResult.showPopover.value).toBe(true)
    })

    BddTest().then('the popover position should remain unchanged', () => {
      expect(usePopoverResult.popoverPosition.value).toEqual({ top: 0, left: 0 })
    })
  })

  BddTest().when('the popover is toggled open with trigger ref', () => {
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

    BddTest().then('the popover should be visible', () => {
      expect(usePopoverResult.showPopover.value).toBe(true)
    })

    BddTest().then('the popover position should be updated based on trigger position', () => {
      expect(usePopoverResult.popoverPosition.value).toEqual({
        top: (100 + window.scrollY + 4) / 16,
        left: (100 + window.scrollX) / 16
      })
    })
  })

  BddTest().when('the popover would overflow the viewport', () => {
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

    BddTest().then('the popover should reposition to stay inside viewport', () => {
      expect(usePopoverResult.popoverPosition.value.left).toBe((1200 - 300 - 16) / 16)
    })
  })

  BddTest().when('the popover would overflow completely on the left', () => {
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

    BddTest().then('the popover should reposition to minimum margin if left is negative', () => {
      expect(usePopoverResult.popoverPosition.value.left).toBe(1)
    })
  })

  BddTest().when('closePopover is called', () => {
    beforeEach(() => {
      usePopoverResult.showPopover.value = true
      usePopoverResult.closePopover()
    })

    BddTest().then('the popover should be hidden', () => {
      expect(usePopoverResult.showPopover.value).toBe(false)
    })
  })

  BddTest().when('a click outside the trigger is detected', () => {
    beforeEach(() => {
      usePopoverResult.showPopover.value = true
      const outsideElement = document.createElement('div')
      const clickEvent = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(clickEvent, 'target', { value: outsideElement })

      const handler = addEventListenerSpy.mock.calls.find(call => call[0] === 'click')?.[1] as EventListener
      handler?.(clickEvent)
    })

    BddTest().then('the popover should be closed', async () => {
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

  BddTest().when('a click inside the trigger is detected', () => {
    beforeEach(() => {
      const triggerElement = document.createElement('button')
      triggerRef.value = triggerElement

      const clickEvent = new MouseEvent('click', { bubbles: true })
      Object.defineProperty(clickEvent, 'target', { value: triggerElement })

      const handler = addEventListenerSpy.mock.calls.find(call => call[0] === 'click')?.[1] as EventListener
      handler?.(clickEvent)
    })

    BddTest().then('the popover should remain unchanged', () => {
      expect(usePopoverResult.showPopover.value).toBe(false)
    })
  })

  BddTest().when('the component is unmounted', () => {
    BddTest().then('the click listener should be removed', () => {
      unmount()
      expect(removeEventListenerSpy).toHaveBeenCalledWith('click', expect.any(Function))
    })
  })

  BddTest().when('the popover would overflow completely on the left (left < 0)', () => {
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

      // Ici on simule un viewport très petit pour que left < 0
      vi.stubGlobal('innerWidth', 500)

      await usePopoverResult.togglePopover()
      await nextTick()
    })

    BddTest().then('the popover position should be adjusted to 16 (minimum margin)', () => {
      expect(usePopoverResult.popoverPosition.value.left).toBe(16 / 16)
    })
  })
})
