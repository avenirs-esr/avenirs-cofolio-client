export const ActivityDraftCreationModalStub = defineComponent({
  name: 'ActivityDraftCreationModal',
  props: {
    opened: {
      type: Boolean,
    },
  },
  emits: ['close'],
  template: '<div data-testid="activity-draft-creation-modal-stub"></div>',
})
