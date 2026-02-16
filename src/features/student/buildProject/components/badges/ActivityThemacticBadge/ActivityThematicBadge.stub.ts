export const ActivityThemacticBadgeStub = defineComponent({
  name: 'ActivityThemacticBadge',
  props: {
    thematic: {
      type: String,
      required: true
    }
  },
  template: `<div data-testid="activity-thematic-badge">{{ thematic }}</div>`
})
