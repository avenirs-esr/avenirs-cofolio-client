export const AssociatedElementSummaryCardStub = defineComponent({
  name: 'AssociatedElementSummaryCard',
  template: '<div data-testid="associated-element-summary-card-stub"><slot /></div>',
  props: {
    feedbackId: {
      type: String,
      required: true,
    },
  },
})
