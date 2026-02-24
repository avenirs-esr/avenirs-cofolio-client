export const PaginationStub = defineComponent({
  name: 'Pagination',
  props: ['pageInfo', 'pageSizeSelected', 'withoutPageSizePicker', 'onUpdateCurrentPage', 'onUpdatePageSize'],
  template: `
      <div class="pagination-stub">
        <button class="emit-current-page" @click="onUpdateCurrentPage(5)">Page 5</button>
        <button class="emit-page-size" @click="onUpdatePageSize(12)">Size 12</button>
        <slot />
      </div>
    `
})
