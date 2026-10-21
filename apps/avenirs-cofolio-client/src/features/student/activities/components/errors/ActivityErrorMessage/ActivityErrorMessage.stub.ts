export const ActivityErrorMessageStub = defineComponent({
  name: 'ActivityErrorMessage',
  props: ['error'],
  template: '<div v-if="error" data-testid="activity-error-message-stub"></div>'
})
