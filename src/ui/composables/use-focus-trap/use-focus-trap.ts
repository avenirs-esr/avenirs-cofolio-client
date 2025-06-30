import type { Ref } from 'vue'
import { createFocusTrap } from 'focus-trap'

/**
 * Résultat retourné par le composable useFocusTrap.
 */
export interface UseFocusTrapReturn {
  /** Initialise et active le focus trap sur l'élément référencé */
  initializeFocusTrap: () => void
  /** Désactive et nettoie le focus trap */
  cleanupFocusTrap: () => void
}

/**
 * Composable Vue pour gérer un focus trap sur un élément DOM.
 *
 * Ce composable utilise la bibliothèque [focus-trap](https://github.com/focus-trap/focus-trap)
 * afin d'enfermer la navigation clavier dans un élément donné (ex: une modale).
 *
 * @param elementRef Référence vers l'élément DOM à piéger (focus trap)
 * @param onClose Fonction callback appelée lorsque le focus trap est désactivé (ex: fermeture)
 *
 * @returns {UseFocusTrapReturn} Objet contenant les fonctions pour gérer le focus trap :
 *  - `initializeFocusTrap` : active le focus trap,
 *  - `cleanupFocusTrap` : désactive et nettoie le focus trap.
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
