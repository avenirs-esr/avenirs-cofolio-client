import { defineComponent } from 'vue'

export const AddToolDrawerStub = defineComponent({
  name: 'AddToolDrawer',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    isNational: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close'],
  template: '<div data-testid="add-tool-drawer-stub" />',
})
