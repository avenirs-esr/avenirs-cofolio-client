export function usePopover () {
  const showPopover = ref(false)

  function togglePopover (event: Event) {
    event.stopPropagation()
    showPopover.value = !showPopover.value
  }

  function closePopover () {
    showPopover.value = false
  }

  onMounted(() => {
    document.addEventListener('click', closePopover)
  })

  onUnmounted(() => {
    document.removeEventListener('click', closePopover)
  })

  return {
    showPopover,
    togglePopover,
    closePopover
  }
}
