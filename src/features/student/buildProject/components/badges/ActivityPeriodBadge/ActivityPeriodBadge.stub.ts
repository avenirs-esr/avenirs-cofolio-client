export const ActivityPeriodBadgeStub = defineComponent({
  name: 'ActivityPeriodBadge',
  props: {
    small: {
      type: Boolean,
      default: false
    }
  },
  template: `<div data-testid="activity-period-summary-badge" />`
})
