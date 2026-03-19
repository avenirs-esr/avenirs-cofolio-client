export const DeleteActivityAssociatedTracesModalStub = defineComponent({
  name: 'DeleteActivityAssociatedTracesModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    declaredActivityId: {
      type: String,
      required: true,
    }
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-activity-associated-traces-modal-stub" />',
})
