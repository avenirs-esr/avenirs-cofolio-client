export const WarningBadgeStub = defineComponent({
  name: 'WarningBadge',
  props: {
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    borderColor: {
      type: String,
      required: false,
    },
    small: {
      type: Boolean,
      required: false,
    },
  },
  template: '<div data-testid="warning-badge-stub" />',
})
