export const ActivityThematicBadgeStub = defineComponent({
  name: 'ActivityThematicBadge',
  props: {
    thematic: {
      type: String,
      required: true
    }
  },
  template: `<div data-testid="activity-thematic-badge">{{ thematic }}</div>`
})
