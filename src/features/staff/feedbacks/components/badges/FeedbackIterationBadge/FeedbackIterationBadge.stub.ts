export const FeedbackIterationBadgeStub = defineComponent({
  name: 'FeedbackIterationBadge',
  props: { iteration: { type: Number, required: true }
  },
  template: `<div data-testid="feedback-iteration-badge">Demande #{{ iteration }}</div>`
})
