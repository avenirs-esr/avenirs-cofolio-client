export const ActivityRightsUserRowStub = defineComponent({
  name: 'ActivityRightsUserRow',
  template: '<div data-testid="activity-rights-user-row-stub"></div>',
  props: {
    user: {
      type: Object,
      required: true,
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue', 'delete'],
})
