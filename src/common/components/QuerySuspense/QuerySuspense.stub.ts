export const QuerySuspenseStub = defineComponent({
  name: 'QuerySuspense',
  template: `
    <div data-testid="query-suspense-stub">
      <div v-if="isLoading" data-testid="query-suspense-loading" />
      <slot />
      <slot name="error"><div v-if="error" data-testid="query-suspense-error" /></slot>
      <slot name="empty"><div v-if="isEmpty" data-testid="query-suspense-empty" /></slot>
    </div>
  `,
  props: {
    error: {
      type: Object,
      default: null,
    },
    errorTitle: {
      type: String,
    },
    errorDescription: {
      type: String,
    },
    emptyStateMessage: {
      type: String,
    },
    isEmpty: {
      type: Boolean,
    },
    isLoading: {
      type: Boolean,
    },
  }
})
