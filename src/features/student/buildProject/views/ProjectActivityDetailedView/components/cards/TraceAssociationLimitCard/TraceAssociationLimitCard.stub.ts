export const TraceAssociationLimitCardStub = defineComponent({
  name: 'TraceAssociationLimitCard',
  props: {
    traceAllowedAssociations: {
      type: Number,
      required: true,
    },
  },
  template: '<div data-testid="trace-association-limit-card" />',
})
