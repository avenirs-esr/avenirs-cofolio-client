export const SearchAssociationLayoutStub = defineComponent({
  name: 'SearchAssociationLayout',
  template: `
    <div data-testid="search-association-layout-stub">
      <div data-testid="search-association-layout-search-stub">
        <slot name="search" />
      </div>
      <div data-testid="search-association-layout-selected-stub">
        <slot name="selected" />
      </div>
    </div>
  `
})
