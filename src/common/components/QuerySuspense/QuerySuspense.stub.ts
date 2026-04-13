export const QuerySuspenseStub = defineComponent({
  name: 'QuerySuspense',
  template: '<div data-testid="query-suspense-stub"><slot /><slot name="error" /><slot name="empty" /></div>',
  props: {
    error: {
      type: Object,
      default: null,
    },
    errorTitle: {
      type: String,
    },
    emptyStateMessage: {
      type: String,
    },
    isEmpty: {
      type: Boolean,
    },
  }
})
