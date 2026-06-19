export const FeedbackAssociatedElementsCardStub = defineComponent({
  name: 'FeedbackAssociatedElementsCard',
  template: '<div data-testid="feedback-associated-elements-card-stub"><slot /></div>',
  props: {
    feedbackId: {
      type: String,
      required: true,
    },
  },
})
