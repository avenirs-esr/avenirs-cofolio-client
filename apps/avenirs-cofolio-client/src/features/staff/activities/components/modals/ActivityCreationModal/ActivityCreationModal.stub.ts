export const ActivityCreationModalStub = defineComponent({
  name: 'ActivityCreationModal',
  props: {
    opened: {
      type: Boolean,
    },
    activityDraftId: {
      type: String,
    },
  },
  emits: ['close'],
  template: '<div data-testid="activity-creation-modal-stub"></div>',
})
