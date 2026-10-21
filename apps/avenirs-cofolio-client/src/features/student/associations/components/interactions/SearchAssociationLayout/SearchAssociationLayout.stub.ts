export const SearchAssociationLayoutStub = defineComponent({
  name: 'SearchAssociationLayout',
  props: [
    'modelValue',
    'search',
    'options',
    'items',
    'inputOptions',
    'getOptionKey',
    'getOptionLabel',
    'loading',
    'layout'
  ],
  emits: ['update:modelValue', 'update:search', 'clear', 'clearSelection', 'loadMore', 'delete'],
  template: `
    <div data-testid="search-association-layout-stub">

      <div data-testid="search-association-layout-before-search-stub">
        <slot name="beforeSearch" />
      </div>

      <div data-testid="search-association-layout-autocomplete-stub" />

      <div data-testid="search-association-layout-selected-stub">
        {{ items?.length ?? 0 }}
      </div>

      <div
        v-for="item in items"
        :key="item.id"
        data-testid="search-association-layout-selected-item-stub"
      >
        <slot name="selectedItem" :item="item" />
      </div>

    </div>
  `
})
