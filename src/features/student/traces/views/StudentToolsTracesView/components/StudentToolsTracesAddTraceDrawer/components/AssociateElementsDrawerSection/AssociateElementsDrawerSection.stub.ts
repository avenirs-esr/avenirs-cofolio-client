export const AssociateElementsDrawerSectionStub = defineComponent({
  name: 'AssociateElementsDrawerSection',
  props: {
    typeConfigs: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    selectionsByType: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['update:selectionsByType', 'search', 'typeChange'],
  template: '<div data-testid="associate-elements-drawer-section-stub"></div>',
})
