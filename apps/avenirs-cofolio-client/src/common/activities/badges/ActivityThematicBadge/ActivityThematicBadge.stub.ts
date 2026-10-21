export const ActivityThematicBadgeStub = defineComponent({
  name: 'ActivityThematicBadge',
  props: {
    thematic: {
      type: String,
      required: true
    },
    small: {
      type: Boolean,
      default: false
    }
  },
  template: `<div data-testid="activity-thematic-badge">{{ thematic }}</div>`
})
