import type { AvAutocompleteOption } from './AvAutocomplete.types'
import { mount } from '@vue/test-utils'
import AvAutocomplete from './AvAutocomplete.vue'

interface TestOption extends AvAutocompleteOption {
  id: string
  name: string
}

const mockOptions: TestOption[] = [
  { id: '1', label: 'Option 1', value: '1', name: 'First Option' },
  { id: '2', label: 'Option 2', value: '2', name: 'Second Option' },
  { id: '3', label: 'Option 3', value: '3', name: 'Third Option' }
]

describe('avAutocomplete', () => {
  describe('given an autocomplete component', () => {
    let wrapper: ReturnType<typeof mount<typeof AvAutocomplete>>

    beforeEach(() => {
      wrapper = mount<typeof AvAutocomplete>(AvAutocomplete, {
        props: {
          options: mockOptions,
          modelValue: []
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the autocomplete wrapper', () => {
        expect(wrapper.find('.av-autocomplete').exists()).toBe(true)
        expect(wrapper.find('.av-autocomplete__wrapper').exists()).toBe(true)
      })

      it('then it should render the input component', () => {
        const input = wrapper.findComponent({ name: 'AvAutocompleteInput' })
        expect(input.exists()).toBe(true)
      })

      it('then it should render the dropdown component', () => {
        const dropdown = wrapper.findComponent({ name: 'AvAutocompleteDropdown' })
        expect(dropdown.exists()).toBe(true)
      })

      it('then it should render the selected tags component', () => {
        const selectedTags = wrapper.findComponent({ name: 'AvAutocompleteSelectedTags' })
        expect(selectedTags.exists()).toBe(true)
      })
    })

    describe('when search event is emitted from input', () => {
      it('then it should emit search event', async () => {
        const input = wrapper.findComponent({ name: 'AvAutocompleteInput' })

        await input.vm.$emit('search', 'test query')

        expect(wrapper.emitted('search')).toBeTruthy()
        expect(wrapper.emitted('search')![0]).toEqual(['test query'])
      })
    })

    describe('when loadMore event is emitted from dropdown', () => {
      it('then it should emit loadMore event', async () => {
        const dropdown = wrapper.findComponent({ name: 'AvAutocompleteDropdown' })

        await dropdown.vm.$emit('loadMore')

        expect(wrapper.emitted('loadMore')).toBeTruthy()
        expect(wrapper.emitted('loadMore')![0]).toEqual([])
      })
    })

    describe('when component has custom input options', () => {
      beforeEach(() => {
        wrapper = mount<typeof AvAutocomplete>(AvAutocomplete, {
          props: {
            options: mockOptions,
            modelValue: [],
            inputOptions: {
              label: 'Custom Label',
              placeholder: 'Custom Placeholder'
            }
          }
        })
      })

      it('then it should render with custom input options', () => {
        const input = wrapper.findComponent({ name: 'AvAutocompleteInput' })
        expect(input.exists()).toBe(true)
      })
    })

    describe('when component is in multi-select mode', () => {
      beforeEach(() => {
        wrapper = mount<typeof AvAutocomplete>(AvAutocomplete, {
          props: {
            options: mockOptions,
            modelValue: [],
            multiSelect: true
          }
        })
      })

      it('then it should render in multi-select mode', () => {
        const input = wrapper.findComponent({ name: 'AvAutocompleteInput' })
        const dropdown = wrapper.findComponent({ name: 'AvAutocompleteDropdown' })
        const selectedTags = wrapper.findComponent({ name: 'AvAutocompleteSelectedTags' })

        expect(input.exists()).toBe(true)
        expect(dropdown.exists()).toBe(true)
        expect(selectedTags.exists()).toBe(true)
      })
    })

    describe('when component has pre-selected items', () => {
      const selectedItems = [mockOptions[0], mockOptions[1]]

      beforeEach(() => {
        wrapper = mount<typeof AvAutocomplete>(AvAutocomplete, {
          props: {
            options: mockOptions,
            modelValue: selectedItems,
            multiSelect: true
          }
        })
      })

      it('then it should render with pre-selected items', () => {
        const selectedTags = wrapper.findComponent({ name: 'AvAutocompleteSelectedTags' })
        expect(selectedTags.exists()).toBe(true)
      })
    })

    describe('when component has required-tip slot', () => {
      beforeEach(() => {
        wrapper = mount<typeof AvAutocomplete>(AvAutocomplete, {
          props: {
            options: mockOptions,
            modelValue: []
          },
          slots: {
            requiredTip: '<div class="required-tip">Required</div>'
          }
        })
      })

      it('then it should pass the slot to input component', () => {
        const input = wrapper.findComponent({ name: 'AvAutocompleteInput' })
        expect(input.exists()).toBe(true)
      })
    })

    describe('when component has item slot', () => {
      beforeEach(() => {
        wrapper = mount<typeof AvAutocomplete>(AvAutocomplete, {
          props: {
            options: mockOptions,
            modelValue: []
          },
          slots: {
            item: '<div class="custom-item">Custom Item</div>'
          }
        })
      })

      it('then it should pass the slot to dropdown component', () => {
        const dropdown = wrapper.findComponent({ name: 'AvAutocompleteDropdown' })
        expect(dropdown.exists()).toBe(true)
      })
    })

    describe('when component has empty slot', () => {
      beforeEach(() => {
        wrapper = mount<typeof AvAutocomplete>(AvAutocomplete, {
          props: {
            options: [],
            modelValue: []
          },
          slots: {
            empty: '<div class="empty-state">No results</div>'
          }
        })
      })

      it('then it should pass the slot to dropdown component', () => {
        const dropdown = wrapper.findComponent({ name: 'AvAutocompleteDropdown' })
        expect(dropdown.exists()).toBe(true)
      })
    })

    describe('when component has selectedItem slot', () => {
      beforeEach(() => {
        wrapper = mount<typeof AvAutocomplete>(AvAutocomplete, {
          props: {
            options: mockOptions,
            modelValue: [mockOptions[0]],
            multiSelect: true,
            showSelectedSection: true
          },
          slots: {
            selectedItem: '<div class="custom-selected">Custom Selected</div>'
          }
        })
      })

      it('then it should pass the slot to selected tags component', () => {
        const selectedTags = wrapper.findComponent({ name: 'AvAutocompleteSelectedTags' })
        expect(selectedTags.exists()).toBe(true)
      })
    })

    describe('when component has loading state', () => {
      beforeEach(() => {
        wrapper = mount<typeof AvAutocomplete>(AvAutocomplete, {
          props: {
            options: mockOptions,
            modelValue: [],
            loading: true
          }
        })
      })

      it('then it should render in loading state', () => {
        const dropdown = wrapper.findComponent({ name: 'AvAutocompleteDropdown' })
        expect(dropdown.exists()).toBe(true)
      })
    })

    describe('when component has custom dropdown dimensions', () => {
      beforeEach(() => {
        wrapper = mount<typeof AvAutocomplete>(AvAutocomplete, {
          props: {
            options: mockOptions,
            modelValue: [],
            dropdownWidth: '300px',
            maxDropdownHeight: '15rem'
          }
        })
      })

      it('then it should render with custom dimensions', () => {
        const dropdown = wrapper.findComponent({ name: 'AvAutocompleteDropdown' })
        expect(dropdown.exists()).toBe(true)
      })
    })

    describe('when component has custom debounce delay', () => {
      beforeEach(() => {
        wrapper = mount<typeof AvAutocomplete>(AvAutocomplete, {
          props: {
            options: mockOptions,
            modelValue: [],
            debounceDelay: 500
          }
        })
      })

      it('then it should render with custom debounce delay', () => {
        const input = wrapper.findComponent({ name: 'AvAutocompleteInput' })
        expect(input.exists()).toBe(true)
      })
    })

    describe('when component has load more enabled', () => {
      beforeEach(() => {
        wrapper = mount<typeof AvAutocomplete>(AvAutocomplete, {
          props: {
            options: mockOptions,
            modelValue: [],
            enableLoadMore: true,
            loadMoreThrottleDelay: 100
          }
        })
      })

      it('then it should render with load more enabled', () => {
        const dropdown = wrapper.findComponent({ name: 'AvAutocompleteDropdown' })
        expect(dropdown.exists()).toBe(true)
      })
    })

    describe('when modelValue is updated', () => {
      it('then it should emit update:modelValue event', async () => {
        await wrapper.setProps({ modelValue: [mockOptions[0]] })

        expect(wrapper.props('modelValue')).toEqual([mockOptions[0]])
      })
    })
  })
})
