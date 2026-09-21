export const RequestFeedbackStub = defineComponent({
  name: 'RequestFeedback',
  props: ['disabled', 'disabledTooltip', 'isLoading', 'remainingFeedbacks', 'feedbackStatus', 'feedbackCreatedAt'],
  emits: ['requestFeedback'],
  template: `<div class="request-feedback-stub"></div>`
})
