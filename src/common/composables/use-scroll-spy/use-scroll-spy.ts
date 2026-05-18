/**
 * A composable function that tracks the currently visible element from a list of element IDs.
 * @param elementIds - An array of element IDs to observe.
 * @returns An object { activeElementId } containing the ID of the currently active element or an empty string if no element is active.
 *
 * @example
 * const { activeElementId } = useScrollSpy(['element1', 'element2', 'element3'])
 * const isManualNavigation = ref(false)
 *
 * function navigateToSelectedItem (item: AvSideNavigationSelectedItem) {
 *   isManualNavigation.value = true
 *   selectedItem.value = item
 *   scrollToElement(item.itemId)
 *   window.setTimeout(() => {
 *     isManualNavigation.value = false
 *   }, 500)
 * }
 *
 * watch(activeElementId, () => {
 *   if (!isManualNavigation.value) {
 *     selectedItem.value = { itemId: activeElementId.value ?? '' }
 *   }
 * })
 */
export function useScrollSpy (elementIds: string[]) {
  const activeElementId = ref<string>()

  const updateActiveElementId = () => {
    const elements = elementIds
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[]

    const closestElement = elements.reduce((closest, element) => {
      const rect = element.getBoundingClientRect()

      const distanceToTop = Math.abs(rect.top - 120)

      if (!closest || distanceToTop < closest.distance) {
        return {
          id: element.id,
          distance: distanceToTop,
        }
      }

      return closest
    }, null as { id: string, distance: number } | null)

    activeElementId.value = closestElement?.id ?? ''
  }

  onMounted(() => {
    updateActiveElementId()

    window.addEventListener('scroll', updateActiveElementId, {
      passive: true,
    })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateActiveElementId)
  })

  return {
    activeElementId,
  }
}
