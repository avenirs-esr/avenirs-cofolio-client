export const ActivityCardStub = defineComponent({
  name: 'ActivityCard',
  props: {
    activity: {
      type: Object,
      required: true
    },
    hideNewLabel: {
      type: Boolean,
      default: false
    }
  },
  template: `
    <div data-testid="activity-card-stub">
      <span data-testid="activity-title">{{ activity.title }}</span>
      <span
        v-if="activity.isNew && !hideNewLabel"
        data-testid="activity-new-badge"
      ></span>
    </div>
  `
})
