export const TraceAssociationLimitCardStub = defineComponent({
  name: 'TraceAssociationLimitCard',
  props: {
    traceAllowedAssociations: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
  },
  template: '<div data-testid="trace-association-limit-card" />',
})
