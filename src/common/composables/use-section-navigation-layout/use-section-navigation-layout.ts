import type { SectionNavigationItem } from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.types'
import type { ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface UseSectionNavigationLayoutParams<TSection extends string> {
  items: ComputedRef<SectionNavigationItem[]>
  fallbackSection: TSection
  queryParamName?: string
}

interface UseSectionNavigationLayoutReturn<TSection extends string> {
  defaultSection: ComputedRef<TSection>
  navigateToSelectedSection: (sectionId: string) => void
}

/**
 * A composable to be used with SectionNavigationLayout that synchronizes the selected section with a query param.
 * It determines the default section based on the current route and provides a
 * function to navigate to a section when selected.
 * @param {UseSectionNavigationLayoutParams<TSection>} param0 composable parameters.
 * @param {ComputedRef<SectionNavigationItem[]>} param0.items navigation items used by the layout.
 * @param {TSection} param0.fallbackSection section used when no route or item matches.
 * @param {string} [param0.queryParamName] query param used to store the selected section.
 * @returns {UseSectionNavigationLayoutReturn<TSection>} default section and section navigation handler.
 */
export function useSectionNavigationLayout<TSection extends string> ({
  items,
  fallbackSection,
  queryParamName = 'section',
}: UseSectionNavigationLayoutParams<TSection>): UseSectionNavigationLayoutReturn<TSection> {
  const route = useRoute()
  const router = useRouter()

  const defaultSection = computed<TSection>(() => {
    const currentSection = route.query[queryParamName]
    const sectionFromQuery = typeof currentSection === 'string'
      ? currentSection as TSection
      : undefined

    if (sectionFromQuery && items.value.some(item => item.id === sectionFromQuery)) {
      return sectionFromQuery
    }

    const firstItem = items.value[0]?.id

    if (firstItem) {
      return firstItem as TSection
    }

    return fallbackSection
  })

  function navigateToSelectedSection (sectionId: string) {
    const section = sectionId as TSection

    if (!items.value.some(item => item.id === section) || route.query[queryParamName] === section) {
      return
    }

    router.replace({
      query: {
        ...route.query,
        [queryParamName]: section,
      }
    })
  }

  return {
    defaultSection,
    navigateToSelectedSection,
  }
}
