export const DashboardSectionStub = defineComponent({
  name: 'DashboardSection',
  props: {
    title: {
      type: String,
      required: true,
    },
    titleIcon: {
      type: String,
    },
    isLoading: {
      type: Boolean,
    },
    isEmpty: {
      type: Boolean,
    },
    emptyStateMessage: {
      type: String,
    },
    error: {
      type: Object,
      default: null,
    },
  },
  template: `
    <div data-testid="dashboard-section-stub">
      <div v-if="isLoading" data-testid="dashboard-section-loading" />
      <div v-else-if="error" data-testid="dashboard-section-error" />
      <div v-else-if="isEmpty" data-testid="dashboard-section-empty">{{ emptyStateMessage }}</div>
      <slot v-else />
    </div>
  `,
})
