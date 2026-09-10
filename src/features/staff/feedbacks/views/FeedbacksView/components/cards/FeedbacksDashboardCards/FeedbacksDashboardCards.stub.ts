export const FeedbacksDashboardCardsStub = defineComponent({
  name: 'FeedbacksDashboardCards',
  props: {
    title: String,
    totalFeedbacks: Number,
    newFeedbacks: Number,
    unprocessedFeedbacks: Number,
    sentFeedbacks: Number,
  },
  template: '<div data-testid="feedbacks-dashboard-cards-stub" />'
})
