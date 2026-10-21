import type { Ref } from 'vue'

/**
 * useDrawer returned result.
 */
export interface UseDrawerReturn {
  /** Indicates if the drawer is visible */
  showDrawer: Ref<boolean>
  /** Method that opens the drawer */
  displayDrawer: () => void
  /** Method that closes the drawer */
  hideDrawer: () => void
}

/**
 * Vue composable to handle drawer display state.
 *
 * This method provides :
 * - a reactive state `showDrawer` that indicates if the drawer is visible,
 * - a méthod `displayDrawer` that opens the drawer,
 * - a method `hideDrawer` that closes the drawer.
 *
 * @returns {UseDrawerReturn} Object containing :
 *  - `showDrawer` (Ref<boolean>) : drawer visibility state,
 *  - `displayDrawer` (function) : method that opens the drawer,
 *  - `hideDrawer` (function) : that closes the drawer.
 */
export function useDrawer (): UseDrawerReturn {
  const showDrawer = ref(false)

  function displayDrawer () {
    showDrawer.value = true
  }

  function hideDrawer () {
    showDrawer.value = false
  }

  return {
    showDrawer,
    displayDrawer,
    hideDrawer
  }
}
