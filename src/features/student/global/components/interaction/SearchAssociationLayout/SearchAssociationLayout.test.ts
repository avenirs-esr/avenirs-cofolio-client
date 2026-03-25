import SearchAssociationLayout from '@/features/student/global/components/interaction/SearchAssociationLayout/SearchAssociationLayout.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const isMobileMock = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: isMobileMock,
    })
  }
})

BddTest().given('a search association layout', () => {
  let wrapper: ReturnType<typeof mount<typeof SearchAssociationLayout>>

  beforeEach(() => {
    isMobileMock.value = false

    wrapper = mount<typeof SearchAssociationLayout>(SearchAssociationLayout, {
      slots: {
        search: '<div data-testid="search-slot-content">Search content</div>',
        selected: '<div data-testid="selected-slot-content">Selected content</div>'
      }
    })
  })

  BddTest().when('the component is mounted on desktop', () => {
    BddTest().then('it should render the layout wrapper', () => {
      expect(wrapper.find('[data-testid="search-association-layout"]').exists()).toBe(true)
    })

    BddTest().then('it should render the search slot container', () => {
      expect(wrapper.find('[data-testid="search-association-layout-search"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="search-slot-content"]').exists()).toBe(true)
    })

    BddTest().then('it should render the selected slot container', () => {
      expect(wrapper.find('[data-testid="search-association-layout-selected"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="selected-slot-content"]').exists()).toBe(true)
    })

    BddTest().then('it should use desktop layout classes', () => {
      const layout = wrapper.find('[data-testid="search-association-layout"]')

      expect(layout.classes()).toContain('search-association-layout')
      expect(layout.classes()).toContain('av-row')
      expect(layout.classes()).toContain('av-align-stretch')
      expect(layout.classes()).not.toContain('av-col')
    })
  })

  BddTest().when('the component is mounted on mobile', () => {
    beforeEach(() => {
      isMobileMock.value = true

      wrapper = mount<typeof SearchAssociationLayout>(SearchAssociationLayout, {
        slots: {
          search: '<div data-testid="search-slot-content">Search content</div>',
          selected: '<div data-testid="selected-slot-content">Selected content</div>'
        }
      })
    })

    BddTest().then('it should use mobile layout classes', () => {
      const layout = wrapper.find('[data-testid="search-association-layout"]')

      expect(layout.classes()).toContain('search-association-layout')
      expect(layout.classes()).toContain('av-col')
      expect(layout.classes()).not.toContain('av-row')
      expect(layout.classes()).not.toContain('av-align-stretch')
    })

    BddTest().then('it should still render both slots', () => {
      expect(wrapper.find('[data-testid="search-slot-content"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="selected-slot-content"]').exists()).toBe(true)
    })
  })

  BddTest().when('no slots are provided', () => {
    beforeEach(() => {
      wrapper = mount<typeof SearchAssociationLayout>(SearchAssociationLayout)
    })

    BddTest().then('it should still render the layout containers', () => {
      expect(wrapper.find('[data-testid="search-association-layout"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="search-association-layout-search"]').exists()).toBe(true)
      expect(wrapper.find('[data-testid="search-association-layout-selected"]').exists()).toBe(true)
    })
  })
})
