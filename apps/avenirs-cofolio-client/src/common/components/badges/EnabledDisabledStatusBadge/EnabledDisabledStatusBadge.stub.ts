export const EnabledDisabledStatusBadgeStub = defineComponent({
  name: 'EnabledDisabledStatusBadge',
  props: {
    enabled: {
      type: Boolean,
      required: true,
    },
    feminineLabel: {
      type: Boolean,
      default: true,
    },
  },
  template: '<div class="enabled-status-badge-stub" />',
})
