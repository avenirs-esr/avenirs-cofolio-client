export const AvListItemStub = defineComponent({
  name: 'AvListItem',
  props: ['clickable', 'hoverBackgroundColor', 'selected', 'icon', 'iconSize', 'iconColor', 'colorOnHover'],
  emits: ['click'],
  template: '<div class="av-list-item-stub" @click="$emit(\'click\')"><slot /></div>'
})
