export const ActivityStatusBadgeStub = defineComponent({
  name: 'ActivityStatusBadge',
  props: {
    status: {
      type: String,
      required: true
    }
  },
  template: `<div data-testid="activity-status-badge">{{ status }}</div>`
})
