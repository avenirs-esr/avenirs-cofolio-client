import { nextTick, type Ref } from 'vue'

/**
 * Result returned by the usePopover composable.
 */
export interface UsePopoverReturn {
  /** Indicates whether the popover is visible */
  showPopover: Ref<boolean>
  /** Position of the popover in rem */
  popoverPosition: Ref<{ top: number, left: number }>
  /** Function to open/close the popover */
  togglePopover: () => Promise<void>
  /** Function to close the popover */
  closePopover: () => void
}

/**
 * Vue composable to manage the display state and position of a popover.
 *
 * This function provides:
 * - a reactive `showPopover` state indicating whether the popover is visible,
 * - a `popoverPosition` object calculating the top/left position in REM,
 * - a `togglePopover` function to open or close the popover,
 * - a `closePopover` function to explicitly close the popover,
 *
 * It also ensures that the popover is closed when an outside click is detected.
 *
 * The popover position is calculated based on the trigger element position,
 * taking into account the window width to prevent the popover from overflowing.
 *
 * @param {Ref<HTMLElement | null>} triggerRef Reference to the popover trigger element.
 * @param {Ref<HTMLElement | null>} popoverRef Reference to the popover DOM element.
 *
 * @returns {UsePopoverReturn} Object containing:
 * - `showPopover` (Ref<boolean>): Visible state of the popover,
 * - `popoverPosition` (Ref<{ top: number, left: number }>): Position calculated in rem,
 * - `togglePopover` (function): Function to toggle the popover display,
 * - `closePopover` (function): Function to close the popover.
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
