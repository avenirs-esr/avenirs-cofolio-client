export const AssociationSearchFilterSelectStub = defineComponent({
  name: 'AssociationSearchFilterSelect',
  props: ['modelValue', 'contextType', 'label', 'labelVisible'],
  emits: ['update:modelValue'],
  template: '<div data-testid="association-search-filter-select-stub" />'
})
