export const AutocompleteStub = defineComponent({
  name: 'Autocomplete',
  props: {
    modelValue: null,
    options: null,
    loading: null,
    inputOptions: null,
    getOptionLabel: null,
    getOptionKey: null,
    multiSelect: { type: Boolean, default: undefined },
    showSelectedSection: null,
    serverSideFiltering: { type: Boolean, default: undefined },
    enableLoadMore: null,
    displaySelectionInInput: null,
    maxDropdownHeight: null,
    search: null,
    showClearSelectionButton: null,
    dropdownClass: null,
  },
  emits: ['update:modelValue', 'clear', 'loadMore', 'update:search'],
  template: `
    <div class="av-autocomplete-stub">
      <slot
        name="item"
        v-for="option in options"
        :key="option.id"
        :option="option"
        :is-selected="false"
        :toggle="() => {}"
      />
    </div>
  `
})
