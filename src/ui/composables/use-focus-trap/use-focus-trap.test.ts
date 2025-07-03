import { useFocusTrap } from '@/ui/composables/use-focus-trap/use-focus-trap'
import { mountComposable } from '@/ui/tests/utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

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

describe('given useFocusTrap composable', () => {
  let elementRef = ref<HTMLElement | null>(null)
  let onClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    elementRef = ref(null)
    onClose = vi.fn()
  })

  describe('when elementRef is null', () => {
    it('then initializeFocusTrap does nothing and does not activate focus trap', () => {
      const { result, unmount } = mountComposable(() => useFocusTrap(elementRef, onClose), {})
      result.initializeFocusTrap()
      expect(mockActivate).not.toHaveBeenCalled()
      unmount()
    })
  })

  describe('when elementRef has no focusable children', () => {
    it('then initializeFocusTrap does not activate focus trap', () => {
      const el = document.createElement('div')
      elementRef.value = el

      const { result, unmount } = mountComposable(() => useFocusTrap(elementRef, onClose), {})
      result.initializeFocusTrap()

      expect(mockActivate).not.toHaveBeenCalled()
      unmount()
    })
  })

  describe('when elementRef has focusable children', () => {
    it('then initializeFocusTrap creates and activates the focus trap', () => {
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

  describe('when cleanupFocusTrap is called', () => {
    it('then deactivate is called and focusTrap is nulled', () => {
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

    it('then calling cleanupFocusTrap without focusTrap does not throw', () => {
      const { result, unmount } = mountComposable(() => useFocusTrap(elementRef, onClose), {})
      expect(() => result.cleanupFocusTrap()).not.toThrow()
      expect(mockDeactivate).not.toHaveBeenCalled()
      unmount()
    })
  })
})
