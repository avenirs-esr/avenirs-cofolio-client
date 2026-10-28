export const AssessmentStatusBadgeStub = defineComponent({
  name: 'AssessmentStatusBadge',
  props: { assessmentStatus: { type: String, required: true } },
  template: '<div data-testid="assessment-status-badge">{{ assessmentStatus }}</div>'
})
