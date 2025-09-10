import { useFocusTrap } from '@/ui/composables/use-focus-trap/use-focus-trap'
import { mountComposable } from '@/ui/tests/utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockActivate = vi.fn()
const mockDeactivate = vi.fn()

vi.mock('focus-trap', () => {
  return {
    createFocusTrap: vi.fn(() => ({
      activate: mockActivate,
      deactivate: mockDeactivate
    }))
  }
})

BddTest().given('useFocusTrap composable', () => {
  let elementRef = ref<HTMLElement | null>(null)
  let onClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    elementRef = ref(null)
    onClose = vi.fn()
  })

  BddTest().when('elementRef is null', () => {
    BddTest().then('initializeFocusTrap does nothing and does not activate focus trap', () => {
      const { result, unmount } = mountComposable(() => useFocusTrap(elementRef, onClose), {})
      result.initializeFocusTrap()
      expect(mockActivate).not.toHaveBeenCalled()
      unmount()
    })
  })

  BddTest().when('elementRef has no focusable children', () => {
    BddTest().then('initializeFocusTrap does not activate focus trap', () => {
      const el = document.createElement('div')
      elementRef.value = el

      const { result, unmount } = mountComposable(() => useFocusTrap(elementRef, onClose), {})
      result.initializeFocusTrap()

      expect(mockActivate).not.toHaveBeenCalled()
      unmount()
    })
  })

  BddTest().when('elementRef has focusable children', () => {
    BddTest().then('initializeFocusTrap creates and activates the focus trap', () => {
      const el = document.createElement('div')
      const button = document.createElement('button')
      el.appendChild(button)
      elementRef.value = el

      const { result, unmount } = mountComposable(() => useFocusTrap(elementRef, onClose), {})
      result.initializeFocusTrap()

      expect(mockActivate).toHaveBeenCalled()
      unmount()
    })
  })

  BddTest().when('cleanupFocusTrap is called', () => {
    BddTest().then('deactivate is called and focusTrap is nulled', () => {
      const el = document.createElement('div')
      const button = document.createElement('button')
      el.appendChild(button)
      elementRef.value = el

      const { result, unmount } = mountComposable(() => useFocusTrap(elementRef, onClose), {})
      result.initializeFocusTrap()
      result.cleanupFocusTrap()

      expect(mockDeactivate).toHaveBeenCalled()
      unmount()
    })

    BddTest().then('calling cleanupFocusTrap without focusTrap does not throw', () => {
      const { result, unmount } = mountComposable(() => useFocusTrap(elementRef, onClose), {})
      expect(() => result.cleanupFocusTrap()).not.toThrow()
      expect(mockDeactivate).not.toHaveBeenCalled()
      unmount()
    })
  })
})
