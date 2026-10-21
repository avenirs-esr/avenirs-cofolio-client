export const ActivityNewBadgeStub = defineComponent({
  name: 'ActivityNewBadgeStub',
  props: {
    display: {
      type: String,
      required: false,
    },
  },
  template: `<div data-testid="activity-new-badge-stub">{{ display }}</div>`,
})
