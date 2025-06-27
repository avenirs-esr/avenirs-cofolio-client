import type { Ref } from 'vue'
import { createFocusTrap } from 'focus-trap'

export function useFocusTrap (
  elementRef: Ref<HTMLElement | null>,
  onClose: () => void
) {
  let focusTrap: ReturnType<typeof createFocusTrap> | null = null

  function initializeFocusTrap (): void {
    if (!elementRef.value) {
      return
    }

    const focusableElement = elementRef.value.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (!focusableElement) {
      return
    }

    focusTrap = createFocusTrap(elementRef.value, {
      escapeDeactivates: true,
      onDeactivate: onClose,
      returnFocusOnDeactivate: true,
      clickOutsideDeactivates: true
    })

    focusTrap.activate()
  }

  function cleanupFocusTrap (): void {
    focusTrap?.deactivate()
    focusTrap = null
  }

  return {
    initializeFocusTrap,
    cleanupFocusTrap
  }
}
