export const AssociateElementTypeSelectStub = defineComponent({
  name: 'AssociateElementTypeSelect',
  props: ['typeConfigs', 'activeTypeKey'],
  emits: ['update:activeTypeKey'],
  template: '<div class="associate-element-type-select-stub"></div>'
})
