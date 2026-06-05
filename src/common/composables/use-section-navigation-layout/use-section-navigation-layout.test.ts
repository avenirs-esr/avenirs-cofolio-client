import type { SectionNavigationItem } from '@/common/components/SectionNavigationLayout/SectionNavigationLayout.types'
import { useSectionNavigationLayout } from '@/common/composables'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

type Section = 'firstSection' | 'secondSection'

const query = ref<Record<string, unknown>>({})
const replaceMock = vi.fn()

vi.mock('vue-router', () => ({
  useRoute: () => ({
    get query () {
      return query.value
    },
  }),
  useRouter: () => ({
    replace: replaceMock,
  }),
}))

const defaultItems: SectionNavigationItem[] = [
  {
    id: 'firstSection',
    label: 'firstSection',
    icon: 'icon-firstSection',
  },
  {
    id: 'secondSection',
    label: 'secondSection',
    icon: 'icon-secondSection',
  },
]

BddTest().given('a useSectionNavigationLayout composable', () => {
  const items = ref<SectionNavigationItem[]>([])

  beforeEach(() => {
    vi.clearAllMocks()
    query.value = {}
    items.value = [...defaultItems]
  })

  BddTest().when('the current query param matches a configured section', () => {
    BddTest().then('it should expose the matching default section and emit selected section label immediately', () => {
      query.value = { section: 'secondSection' }

      const { result } = mountComposable(() => useSectionNavigationLayout<Section>({
        items: computed(() => items.value),
        fallbackSection: 'firstSection',
      }), {})

      expect(result.defaultSection.value).toBe('secondSection')
    })
  })

  BddTest().when('the current query param does not match any configured section', () => {
    BddTest().then('it should fallback to the first available item', () => {
      query.value = { section: 'unknown-section' }

      const { result } = mountComposable(() => useSectionNavigationLayout<Section>({
        items: computed(() => items.value),
        fallbackSection: 'secondSection',
      }), {})

      expect(result.defaultSection.value).toBe('firstSection')
    })
  })

  BddTest().when('no navigation item is available', () => {
    BddTest().then('it should fallback to the provided fallback section', () => {
      items.value = []
      query.value = { section: 'unknown-section' }

      const { result } = mountComposable(() => useSectionNavigationLayout<Section>({
        items: computed(() => items.value),
        fallbackSection: 'secondSection',
      }), {})

      expect(result.defaultSection.value).toBe('secondSection')
    })
  })

  BddTest().when('navigating to a different selected section', () => {
    BddTest().then('it should call router.replace with the selected section query param', () => {
      const { result } = mountComposable(() => useSectionNavigationLayout<Section>({
        items: computed(() => items.value),
        fallbackSection: 'firstSection',
      }), {})

      result.navigateToSelectedSection('secondSection')

      expect(replaceMock).toHaveBeenCalledWith({ query: { section: 'secondSection' } })
    })
  })

  BddTest().when('navigating to the current query param section', () => {
    BddTest().then('it should not call router.replace', () => {
      query.value = { section: 'firstSection' }

      const { result } = mountComposable(() => useSectionNavigationLayout<Section>({
        items: computed(() => items.value),
        fallbackSection: 'firstSection',
      }), {})

      result.navigateToSelectedSection('firstSection')

      expect(replaceMock).not.toHaveBeenCalled()
    })
  })

  BddTest().when('navigating to an unknown section', () => {
    BddTest().then('it should not call router.replace', () => {
      const { result } = mountComposable(() => useSectionNavigationLayout<Section>({
        items: computed(() => items.value),
        fallbackSection: 'firstSection',
      }), {})

      result.navigateToSelectedSection('unknown')

      expect(replaceMock).not.toHaveBeenCalled()
    })
  })
})
