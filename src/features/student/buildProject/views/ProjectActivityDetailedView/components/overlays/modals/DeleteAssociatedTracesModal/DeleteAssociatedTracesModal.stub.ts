export const DeleteAssociatedTracesModalStub = {
  name: 'DeleteAssociatedTracesModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-associated-traces-modal-stub" />',
}
