export const AssessmentActivityTitleStub = defineComponent({
  name: 'AssessmentActivityTitle',
  props: {
    activityTitle: {
      type: String,
      required: true,
    },
  },
  template: '<div data-testid="assessment-activity-title-stub">{{ activityTitle }}</div>',
})
