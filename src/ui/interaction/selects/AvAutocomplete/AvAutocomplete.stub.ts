export const AvAutocompleteStub = defineComponent({
  name: 'AvAutocomplete',
  props: [
    'modelValue',
    'options',
    'loading',
    'inputOptions',
    'getOptionLabel',
    'getOptionKey',
    'multiSelect',
    'serverSideFiltering',
    'enableLoadMore',
    'maxDropdownHeight'
  ],
  emits: ['update:modelValue', 'search', 'clear', 'loadMore'],
  template: '<div class="av-autocomplete-stub"><slot name="item" v-for="option in options" :key="option.id" :option="option" :is-selected="false" :toggle="() => {}" /></div>'
})
