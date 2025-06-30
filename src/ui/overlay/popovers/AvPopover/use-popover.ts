import { nextTick, type Ref } from 'vue'

/**
 * Résultat retourné par le composable usePopover.
 */
export interface UsePopoverReturn {
  /** Indique si la popover est visible */
  showPopover: Ref<boolean>
  /** Position de la popover en rem */
  popoverPosition: Ref<{ top: number, left: number }>
  /** Fonction pour ouvrir/fermer la popover */
  togglePopover: () => Promise<void>
  /** Fonction pour fermer la popover */
  closePopover: () => void
}

/**
 * Composable Vue pour gérer l'état d'affichage et la position d'une popover.
 *
 * Cette fonction fournit :
 * - un état réactif `showPopover` indiquant si la popover est visible,
 * - un objet `popoverPosition` calculant la position top/left en rem,
 * - une fonction `togglePopover` pour ouvrir ou fermer la popover,
 * - une fonction `closePopover` pour fermer la popover explicitement,
 *
 * Elle s'assure aussi de fermer la popover quand un clic extérieur est détecté.
 *
 * La position de la popover est calculée en fonction de la position de l'élément déclencheur,
 * en tenant compte de la largeur de la fenêtre pour éviter que la popover déborde.
 *
 * @param {Ref<HTMLElement | null>} triggerRef Référence vers l'élément déclencheur de la popover.
 * @param {Ref<HTMLElement | null>} popoverRef Référence vers l'élément DOM de la popover.
 *
 * @returns {UsePopoverReturn} Objet contenant :
 *  - `showPopover` (Ref<boolean>) : état visible de la popover,
 *  - `popoverPosition` (Ref<{ top: number, left: number }>) : position calculée en rem,
 *  - `togglePopover` (function) : fonction pour basculer l'affichage de la popover,
 *  - `closePopover` (function) : fonction pour fermer la popover.
 */
export function usePopover (triggerRef: Ref<HTMLElement | null>, popoverRef: Ref<HTMLElement | null>): UsePopoverReturn {
  const showPopover = ref(false)
  const popoverPosition = ref({ top: 0, left: 0 })

  const togglePopover = async () => {
    showPopover.value = !showPopover.value
    if (showPopover.value && triggerRef.value) {
      await nextTick()
      const triggerRect = triggerRef.value.getBoundingClientRect()
      const top = triggerRect.bottom + window.scrollY + 4
      let left = triggerRect.left + window.scrollX

      if (popoverRef.value) {
        const popoverRect = popoverRef.value.getBoundingClientRect()

        const viewportWidth = window.innerWidth
        const popoverRight = left + popoverRect.width

        if (popoverRight > viewportWidth) {
          left = viewportWidth - popoverRect.width - 16
          if (left < 0) {
            left = 16
          }
        }
      }

      // px to rem conversion
      popoverPosition.value = { top: top / 16, left: left / 16 }
    }
  }

  const closePopover = () => {
    showPopover.value = false
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (
      triggerRef.value
      && !triggerRef.value.contains(event.target as Node)
    ) {
      closePopover()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  return {
    showPopover,
    popoverPosition,
    togglePopover,
    closePopover
  }
}
