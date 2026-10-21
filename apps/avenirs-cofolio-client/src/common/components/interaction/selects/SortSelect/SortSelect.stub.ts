export const SortSelectStub = defineComponent({
  name: 'SortSelect',
  props: ['selectedItem'],
  emits: ['update:selectedItem'],
  template: `
    <div data-testid="sort-select-stub">
      <select
        :value="selectedItem?.itemId"
        @change="$emit('update:selectedItem', { itemId: $event.target.value })"
      >
        <option value="NAME_ASC">Trier de A à Z</option>
        <option value="NAME_DESC">Trier de Z à A</option>
        <option value="DATE_DESC">Trier du plus récent au plus ancien</option>
        <option value="DATE_ASC">Trier du plus ancien au plus récent</option>
      </select>
    </div>
  `
})
