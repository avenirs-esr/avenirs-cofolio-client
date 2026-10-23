export const FeedbackStatusPickerStub = defineComponent({
  name: 'FeedbackStatusPickerStub',
  emits: ['select'],
  props: {
    totalFeedbacks: {
      type: Number,
      required: true,
    },
    newFeedbacks: {
      type: Number,
      required: true,
    },
    unprocessedFeedbacks: {
      type: Number,
      required: true,
    },
    sentFeedbacks: {
      type: Number,
      required: true,
    },
  },
  template: '<div data-testid="feedback-status-picker-stub" />',
})
