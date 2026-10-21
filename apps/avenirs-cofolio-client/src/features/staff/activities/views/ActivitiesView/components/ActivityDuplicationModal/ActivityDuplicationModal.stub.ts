export const ActivityDuplicationModalStub = defineComponent({
  name: 'ActivityDuplicationModal',
  props: {
    opened: {
      type: Boolean,
      required: true,
    },
    activityId: {
      type: String,
      required: true,
    },
    activityTitle: {
      type: String,
      required: true,
    },
  },
  emits: ['close', 'duplicated'],
  template: '<div data-testid="activity-duplication-modal-stub"></div>',
})
