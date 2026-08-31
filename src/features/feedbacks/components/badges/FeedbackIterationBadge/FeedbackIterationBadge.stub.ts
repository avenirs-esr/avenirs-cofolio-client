export const FeedbackIterationBadgeStub = defineComponent({
  name: 'FeedbackIterationBadge',
  props: {
    iteration: { type: Number, required: true },
    maxIterations: { type: Number, required: false },
    color: { type: String, required: false },
    backgroundColor: { type: String, required: false },
  },
  template: `<div data-testid="feedback-iteration-badge">Demande #{{ iteration }}</div>`
})
