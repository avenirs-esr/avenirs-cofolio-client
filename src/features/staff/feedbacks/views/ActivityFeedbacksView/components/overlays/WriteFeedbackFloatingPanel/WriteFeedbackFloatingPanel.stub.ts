export const WriteFeedbackFloatingPanelStub = defineComponent({
  name: 'WriteFeedbackFloatingPanel',
  props: {
    activityTitle: {
      type: String,
      required: true,
    },
  },
  template: '<div data-testid="write-feedback-floating-panel-stub" />',
})
