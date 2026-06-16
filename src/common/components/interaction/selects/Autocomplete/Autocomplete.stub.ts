export const AutocompleteStub = defineComponent({
  name: 'Autocomplete',
  props: [
    'modelValue',
    'options',
    'loading',
    'inputOptions',
    'getOptionLabel',
    'getOptionKey',
    'multiSelect',
    'showSelectedSection',
    'serverSideFiltering',
    'enableLoadMore',
    'displaySelectionInInput',
    'maxDropdownHeight',
    'search',
    'showClearSelectionButton',
  ],
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
