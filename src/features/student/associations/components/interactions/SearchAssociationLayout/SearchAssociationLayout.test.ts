import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import { AutocompleteStub } from '@/common/components/interaction/selects/Autocomplete/Autocomplete.stub'
import { SelectedAssociateItemsContainerStub } from '@/features/student/associations/components/cards/SelectedAssociateItemsContainer/SelectedAssociateItemsContainer.stub'
import SearchAssociationLayout from '@/features/student/associations/components/interactions/SearchAssociationLayout/SearchAssociationLayout.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'

export const mockIsMobile = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    })
  }
})

BddTest().given('a search association layout', () => {
  let wrapper: ReturnType<typeof mount<typeof SearchAssociationLayout>>

  const options: AvAutocompleteOption[] = [
    { label: 'Item 1', value: 'item-1' },
    { label: 'Item 2', value: 'item-2' }
  ]

  const items = [
    { id: 'item-1', title: 'Item 1' },
    { id: 'item-2', title: 'Item 2' }
  ]

  const stubs = {
    Autocomplete: AutocompleteStub,
    SelectedAssociateItemsContainer: SelectedAssociateItemsContainerStub
  }

  beforeEach(() => {
    wrapper = mount(SearchAssociationLayout, {
      props: {
        modelValue: [],
        options,
        items,
        inputOptions: {
          placeholder: 'Search items'
        },
        getOptionKey: (option: AvAutocompleteOption) => option.value,
        getOptionLabel: (option: AvAutocompleteOption) => option.label
      },
      slots: {
        beforeSearch: '<div data-testid="before-search-slot-content">Before search content</div>',
        selectedItem: `
          <template #selectedItem="{ item }">
            <div :data-testid="'selected-item-' + item.id">
              {{ item.title }}
            </div>
          </template>
        `
      },
      global: {
        stubs
      }
    })
  })

  afterEach(() => {
    mockIsMobile.value = false
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the layout wrapper', () => {
      expect(wrapper.find('[data-testid="search-association-layout"]').exists()).toBe(true)
    })

    BddTest().then('it should render the beforeSearch slot', () => {
      expect(wrapper.find('[data-testid="before-search-slot-content"]').exists()).toBe(true)
    })

    BddTest().then('it should render the autocomplete', () => {
      const autocomplete = wrapper.findComponent(AutocompleteStub)

      expect(autocomplete.exists()).toBe(true)
      expect(autocomplete.props('modelValue')).toEqual([])
      expect(autocomplete.props('options')).toEqual(options)
      expect(autocomplete.props('multiSelect')).toBe(true)
      expect(autocomplete.props('showSelectedSection') ?? false).toBe(false)
      expect(autocomplete.props('displaySelectionInInput') ?? false).toBe(false)
      expect(autocomplete.props('inputOptions')).toEqual({
        placeholder: 'Search items'
      })
      expect(autocomplete.props('dropdownClass')).toBeUndefined()
    })

    BddTest().then('it should render the selected items container', () => {
      const selectedContainer = wrapper.findComponent(SelectedAssociateItemsContainerStub)

      expect(selectedContainer.exists()).toBe(true)
      expect(selectedContainer.props('items')).toEqual(items)
    })

    BddTest().then('it should use the expected layout classes', () => {
      const layout = wrapper.find('[data-testid="search-association-layout"]')

      expect(layout.classes()).toContain('search-association-layout')
      expect(layout.classes()).toContain('av-col')
      expect(layout.classes()).toContain('av-row--md')
      expect(layout.classes()).toContain('av-align-stretch--md')
      expect(layout.classes()).toContain('av-gap-sm')
      expect(layout.classes()).not.toContain('search-association-layout--mobile')
    })
  })

  BddTest().and('it is viewed in mobile', () => {
    beforeEach(() => {
      mockIsMobile.value = true
      wrapper = mount(SearchAssociationLayout, {
        props: {
          modelValue: [],
          options,
          items,
          getOptionKey: (option: AvAutocompleteOption) => option.value,
          getOptionLabel: (option: AvAutocompleteOption) => option.label
        },
        slots: {
          selectedItem: `
            <template #selectedItem="{ item }">
              <div :data-testid="'selected-item-' + item.id">
                {{ item.title }}
              </div>
            </template>
          `
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should add the mobile modifier class to the layout', () => {
      const layout = wrapper.find('[data-testid="search-association-layout"]')

      expect(layout.classes()).toContain('search-association-layout--mobile')
    })

    BddTest().then('it should pass a dropdown class to the autocomplete to keep it in the document flow', () => {
      const autocomplete = wrapper.findComponent(AutocompleteStub)

      expect(autocomplete.props('dropdownClass')).toBe('search-association-layout__mobile-dropdown')
    })
  })

  BddTest().when('the component is mounted with a vertical layout', () => {
    beforeEach(() => {
      wrapper = mount(SearchAssociationLayout, {
        props: {
          modelValue: [],
          options,
          items,
          layout: 'vertical'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should not use the horizontal layout classes', () => {
      const layout = wrapper.find('[data-testid="search-association-layout"]')

      expect(layout.classes()).toContain('av-col')
      expect(layout.classes()).not.toContain('av-row--md')
      expect(layout.classes()).not.toContain('av-align-stretch--md')
      expect(wrapper.find('[data-testid="search-association-layout-search"]').classes()).not.toContain('av-flex-fill')
    })
  })

  BddTest().when('the autocomplete emits update:modelValue', () => {
    const updatedSelection: AvAutocompleteOption[] = [
      { label: 'Item 1', value: 'item-1' }
    ]

    beforeEach(async () => {
      const autocomplete = wrapper.findComponent(AutocompleteStub)
      autocomplete.vm.$emit('update:modelValue', updatedSelection)
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit update:modelValue', () => {
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([updatedSelection])
    })
  })

  BddTest().when('the autocomplete emits update:search', () => {
    beforeEach(async () => {
      const autocomplete = wrapper.findComponent(AutocompleteStub)
      autocomplete.vm.$emit('update:search', 'item')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit update:search', () => {
      expect(wrapper.emitted('update:search')).toBeTruthy()
      expect(wrapper.emitted('update:search')?.[0]).toEqual(['item'])
    })
  })

  BddTest().when('the autocomplete emits clear', () => {
    beforeEach(async () => {
      const autocomplete = wrapper.findComponent(AutocompleteStub)
      autocomplete.vm.$emit('clear')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit clear', () => {
      expect(wrapper.emitted('clear')).toBeTruthy()
      expect(wrapper.emitted('clear')?.[0]).toEqual([])
    })
  })

  BddTest().when('the autocomplete emits loadMore', () => {
    beforeEach(async () => {
      const autocomplete = wrapper.findComponent(AutocompleteStub)
      autocomplete.vm.$emit('loadMore')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit loadMore', () => {
      expect(wrapper.emitted('loadMore')).toBeTruthy()
      expect(wrapper.emitted('loadMore')?.[0]).toEqual([])
    })
  })

  BddTest().when('the selected items container emits delete', () => {
    beforeEach(async () => {
      const selectedContainer = wrapper.findComponent(SelectedAssociateItemsContainerStub)
      selectedContainer.vm.$emit('delete', 'item-2')
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit delete', () => {
      expect(wrapper.emitted('delete')).toBeTruthy()
      expect(wrapper.emitted('delete')?.[0]).toEqual(['item-2'])
    })
  })

  BddTest().when('no beforeSearch slot is provided', () => {
    beforeEach(() => {
      wrapper = mount(SearchAssociationLayout, {
        props: {
          modelValue: [],
          options,
          items
        },
        slots: {
          selectedItem: `
            <template #selectedItem="{ item }">
              <div :data-testid="'selected-item-' + item.id">
                {{ item.title }}
              </div>
            </template>
          `
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should still render the layout', () => {
      expect(wrapper.find('[data-testid="search-association-layout"]').exists()).toBe(true)
    })

    BddTest().then('it should still render the autocomplete', () => {
      expect(wrapper.findComponent(AutocompleteStub).exists()).toBe(true)
    })

    BddTest().then('it should still render the selected items container', () => {
      expect(wrapper.findComponent(SelectedAssociateItemsContainerStub).exists()).toBe(true)
    })
  })
})
