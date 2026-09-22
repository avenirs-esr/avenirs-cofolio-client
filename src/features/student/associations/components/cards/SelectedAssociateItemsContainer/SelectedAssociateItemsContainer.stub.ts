export const SelectedAssociateItemsContainerStub = defineComponent({
  name: 'SelectedAssociateItemContainer',
  props: ['items'],
  emits: ['delete'],
  template: `
    <div class="selected-associate-items-container-stub">
      <div
        v-for="item in items"
        :key="item.id"
        class="selected-associate-items-container-stub__item"
      >
        {{ item.title }}
      </div>
    </div>
  `
})
