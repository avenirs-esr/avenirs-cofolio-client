export const AddActivityResourceModalStub = defineComponent({
  name: 'AddActivityResourceModal',
  props: {
    opened: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'added'],
  template: '<div data-testid="add-activity-resource-modal-stub" />',
})
