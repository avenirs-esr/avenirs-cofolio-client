export const ActivityDashboardSectionStub = defineComponent({
  name: 'ActivityDashboardSection',
  template: '<div data-testid="activity-dashboard-section-stub"></div>',
  props: {
    activityId: {
      type: String,
      required: true,
    },
  },
})
