export const RequestFeedbackStub = defineComponent({
  name: 'RequestFeedback',
  props: ['disabled', 'isLoading', 'remainingFeedbacks'],
  emits: ['requestFeedback'],
  template: `<div class="request-feedback-stub"></div>`
})
