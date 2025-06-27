import { nextTick, type Ref } from 'vue'

export function usePopover (triggerRef: Ref<HTMLElement | null>, popoverRef: Ref<HTMLElement | null>) {
  const showPopover = ref(false)
  const popoverPosition = ref({ top: 0, left: 0 })

  const togglePopover = async () => {
    showPopover.value = !showPopover.value
    if (showPopover.value && triggerRef.value) {
      await nextTick()
      const triggerRect = triggerRef.value.getBoundingClientRect()
      const top = triggerRect.bottom + window.scrollY
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

      popoverPosition.value = { top, left }
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
