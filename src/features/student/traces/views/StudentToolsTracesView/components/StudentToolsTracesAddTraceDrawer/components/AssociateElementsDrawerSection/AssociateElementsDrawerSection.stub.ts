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
    activeTypeKey: {
      type: String,
      required: true,
    },
    searchQuery: {
      type: String,
      default: '',
    },
  },
  emits: ['update:selectionsByType', 'update:activeTypeKey', 'update:searchQuery'],
  template: '<div data-testid="associate-elements-drawer-section-stub"></div>',
})
