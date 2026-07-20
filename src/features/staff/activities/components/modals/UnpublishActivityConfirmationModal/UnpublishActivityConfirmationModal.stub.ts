export const UnpublishActivityConfirmationModalStub = defineComponent({
  name: 'UnpublishActivityConfirmationModal',
  template: '<div data-testid="unpublish-activity-confirmation-modal-stub"></div>',
  props: {
    show: {
      type: Boolean,
    },
    activityId: {
      type: String,
    },
  },
  emits: ['close', 'unpublished'],
})
