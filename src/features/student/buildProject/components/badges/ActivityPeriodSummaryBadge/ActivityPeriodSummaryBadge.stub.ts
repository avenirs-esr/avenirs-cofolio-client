export const ActivityPeriodSummaryBadgeStub = defineComponent({
  name: 'ActivityPeriodSummaryBadge',
  props: {
    summary: {
      type: String,
      required: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  template: `<div data-testid="activity-period-summary-badge">{{ summary }}</div>`
})
