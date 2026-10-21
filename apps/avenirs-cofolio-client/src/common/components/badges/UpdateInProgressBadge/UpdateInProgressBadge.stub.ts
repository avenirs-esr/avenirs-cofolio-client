export const UpdateInProgressBadgeStub = defineComponent({
  name: 'UpdateInProgressBadge',
  props: {
    show: { type: Boolean, required: true }
  },
  template: '<div v-if="show" data-testid="update-in-progress-badge">Update in progress</div>'
})
