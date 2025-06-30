import type { Ref } from 'vue'

/**
 * Résultat retourné par le composable useModal.
 */
export interface UseModalReturn {
  /** Indique si la modale est visible */
  showModal: Ref<boolean>
  /** Fonction pour afficher la modale */
  displayModal: () => void
  /** Fonction pour masquer la modale */
  hideModal: () => void
}

/**
 * Composable Vue pour gérer l'état d'affichage d'une modale.
 *
 * Cette fonction fournit :
 * - un état réactif `showModal` indiquant si la modale est visible,
 * - une fonction `displayModal` pour ouvrir la modale,
 * - une fonction `hideModal` pour fermer la modale.
 *
 * @returns {UseModalReturn} Objet contenant :
 *  - `showModal` (Ref<boolean>) : état visible de la modale,
 *  - `displayModal` (function) : fonction pour afficher la modale,
 *  - `hideModal` (function) : fonction pour masquer la modale.
 */
export function useModal (): UseModalReturn {
  const showModal = ref(false)

  function displayModal () {
    showModal.value = true
  }

  function hideModal () {
    showModal.value = false
  }

  return {
    showModal,
    displayModal,
    hideModal
  }
}
