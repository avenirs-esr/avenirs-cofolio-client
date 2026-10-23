import type { Ref } from 'vue'

/**
 * Résultat retourné par le composable useModal.
 */
export interface UseModalReturn {
  /** Indique si la modale est ouverte */
  modalOpened: Ref<boolean>
  /** Fonction pour ouvrir la modale */
  openModal: () => void
  /** Fonction pour fermer la modale */
  closeModal: () => void
}

/**
 * Composable Vue pour gérer l'état d'affichage d'une modale.
 *
 * Cette fonction fournit :
 * - un état réactif `modalOpened` indiquant si la modale est ouverte,
 * - une fonction `openModal` pour ouvrir la modale,
 * - une fonction `closeModal` pour fermer la modale.
 *
 * @returns {UseModalReturn} Objet contenant :
 *  - `modalOpened` (Ref<boolean>) : état ouvert de la modale,
 *  - `openModal` (function) : fonction pour ouvrir la modale,
 *  - `closeModal` (function) : fonction pour fermer la modale.
 */
export function useModal (): UseModalReturn {
  const modalOpened = ref(false)

  function openModal () {
    modalOpened.value = true
  }

  function closeModal () {
    modalOpened.value = false
  }

  return {
    modalOpened,
    openModal,
    closeModal
  }
}
