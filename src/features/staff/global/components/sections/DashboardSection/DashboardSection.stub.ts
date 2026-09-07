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
    error: {
      type: Object,
      default: null,
    },
  },
  template: `
    <div data-testid="dashboard-section-stub">
      <div v-if="isLoading" data-testid="dashboard-section-loading" />
      <div v-else-if="error" data-testid="dashboard-section-error" />
      <slot v-else />
    </div>
  `,
})
