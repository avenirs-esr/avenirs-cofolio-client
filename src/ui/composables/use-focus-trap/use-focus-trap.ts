import type { Ref } from 'vue'
import { createFocusTrap } from 'focus-trap'

/**
 * Result returned by the useFocusTrap composable.
 */
export interface UseFocusTrapReturn {
  /** Initializes and activates the focus trap on the referenced element */
  initializeFocusTrap: () => void
  /** Disables and cleans the focus trap */
  cleanupFocusTrap: () => void
}

/**
 * Vue composable to manage a focus trap on a DOM element.
 *
 * This composable uses the [focus-trap](https://github.com/focus-trap/focus-trap) library
 * to enclose keyboard navigation within a given element (e.g., a modal).
 *
 * @param elementRef Reference to the DOM element to trap (focus trap)
 * @param onClose Callback function called when the focus trap is disabled (e.g., closing)
 *
 * @returns {UseFocusTrapReturn} Object containing the functions to manage the focus trap:
 *  - `initializeFocusTrap`: Enables the focus trap,
 *  - `cleanupFocusTrap`: Disables and cleans the focus trap.
 *
 */
export function useFocusTrap (
  elementRef: Ref<HTMLElement | null>,
  onClose: () => void
): UseFocusTrapReturn {
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
