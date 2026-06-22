export const FeedbackStatusBadgeStub = defineComponent({
  name: 'FeedbackStatusBadge',
  props: { feedbackStatus: { type: String, required: true }
  },
  template: '<div data-testid="feedback-status-badge">{{ feedbackStatus }}</div>'
})
