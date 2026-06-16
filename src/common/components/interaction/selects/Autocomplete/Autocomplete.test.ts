import Autocomplete from '@/common/components/interaction/selects/Autocomplete/Autocomplete.vue'
import { AvAutocompleteStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'

BddTest().given('an Autocomplete component', () => {
  let wrapper: ReturnType<typeof mount<typeof Autocomplete>>

  const stubs = { AvAutocomplete: AvAutocompleteStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(Autocomplete, { global: { stubs } })
    })

    BddTest().then('it should render an AvAutocomplete with the translated clearLabel', () => {
      expect(wrapper.findComponent(AvAutocompleteStub).props('clearLabel')).toBe('Effacer la saisie')
    })

    BddTest().then('it should render an AvAutocomplete with the translated clearSelectionLabel', () => {
      expect(wrapper.findComponent(AvAutocompleteStub).props('clearSelectionLabel')).toBe('Effacer la sélection')
    })

    BddTest().and('the user selects an option', () => {
      beforeEach(() => {
        wrapper.findComponent(AvAutocompleteStub).vm.$emit('update:modelValue', 'selectedOption')
      })

      BddTest().then('it should emit an update:modelValue event with the selected option', () => {
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['selectedOption'])
      })
    })

    BddTest().and('the user types in the search input', () => {
      beforeEach(() => {
        wrapper.findComponent(AvAutocompleteStub).vm.$emit('update:search', 'searchTerm')
      })

      BddTest().then('it should emit an update:search event with the search term', () => {
        expect(wrapper.emitted('update:search')?.[0]).toEqual(['searchTerm'])
      })
    })
  })
})
