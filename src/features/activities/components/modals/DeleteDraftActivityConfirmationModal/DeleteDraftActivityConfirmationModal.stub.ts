export const DeleteDraftActivityConfirmationModalStub = defineComponent({
  name: 'DeleteDraftActivityConfirmationModal',
  template: '<div data-testid="delete-draft-activity-confirmation-modal-stub"></div>',
  props: {
    show: {
      type: Boolean,
    },
    activityId: {
      type: String,
    },
  },
  emits: ['close', 'deleted'],
})
