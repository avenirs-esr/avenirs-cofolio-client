export const DeleteDraftActivityConfirmationModalStub = defineComponent({
  name: 'DeleteDraftActivityConfirmationModal',
  template: '<div data-testid="delete-draft-activity-confirmation-modal-stub"></div>',
  props: {
    show: {
      type: Boolean,
    },
  },
  emits: ['close', 'confirm'],
})
