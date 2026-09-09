export const UnpublishActivityConfirmationModalStub = defineComponent({
  name: 'UnpublishActivityConfirmationModal',
  template: '<div data-testid="unpublish-activity-confirmation-modal-stub"></div>',
  props: {
    opened: {
      type: Boolean,
    },
    activityId: {
      type: String,
    },
  },
  emits: ['close', 'unpublished'],
})
