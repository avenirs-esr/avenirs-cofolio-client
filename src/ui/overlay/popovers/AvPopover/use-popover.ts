import { nextTick, type Ref } from 'vue'

export function usePopover (triggerRef: Ref<HTMLElement | null>) {
  const showPopover = ref(false)
  const popoverPosition = ref({ top: 0, left: 0 })

  const togglePopover = async () => {
    showPopover.value = !showPopover.value
    if (showPopover.value && triggerRef.value) {
      await nextTick()
      const rect = triggerRef.value.getBoundingClientRect()
      popoverPosition.value = {
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      }
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
