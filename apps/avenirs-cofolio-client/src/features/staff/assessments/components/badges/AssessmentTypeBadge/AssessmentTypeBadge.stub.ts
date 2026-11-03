export const AssessmentTypeBadgeStub = defineComponent({
  name: 'AssessmentTypeBadge',
  props: { activityType: { type: String, required: true } },
  template: '<div data-testid="activity-type-badge">{{ activityType }}</div>'
})
