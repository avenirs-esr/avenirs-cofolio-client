export const ActivityRightsSectionStub = defineComponent({
  name: 'ActivityRightsSection',
  template: '<div data-testid="activity-rights-section-stub"></div>',
  props: {
    activityId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
})
