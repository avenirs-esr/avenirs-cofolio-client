export const SearchAssociationLayoutStub = defineComponent({
  name: 'SearchAssociationLayout',
  props: [
    'modelValue',
    'options',
    'items',
    'inputOptions',
    'getOptionKey',
    'getOptionLabel',
    'loading'
  ],
  emits: ['update:modelValue', 'search', 'clear', 'loadMore', 'delete'],
  template: `
    <div data-testid="search-association-layout-stub">

      <div data-testid="search-association-layout-before-search-stub">
        <slot name="beforeSearch" />
      </div>

      <div data-testid="search-association-layout-autocomplete-stub" />

      <div data-testid="search-association-layout-selected-stub">
        {{ items?.length ?? 0 }}
      </div>

    </div>
  `
})
