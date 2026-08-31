export const FeedbacksDashboardSectionStub = defineComponent({
  name: 'FeedbacksDashboardSection',
  props: {
    activityId: {
      type: String,
      required: true,
    },
  },
  template: '<div data-testid="feedbacks-dashboard-section-stub" />',
})
