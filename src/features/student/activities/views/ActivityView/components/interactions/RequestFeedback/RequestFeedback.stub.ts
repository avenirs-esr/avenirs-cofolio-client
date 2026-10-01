import type { EFeedbackStatus } from '@/api/avenir-esr'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const RequestFeedbackStub = defineComponent({
  name: 'RequestFeedback',
  props: {
    ...AvInteractivePropsStub,
    isLoading: {
      type: Boolean,
      required: false
    },
    feedbackStatus: {
      type: String as PropType<EFeedbackStatus>,
      required: false
    },
    feedbackCreatedAt: {
      type: String,
      required: false
    },
    remainingFeedbacks: {
      type: Number,
      required: false
    }
  },
  emits: ['requestFeedback'],
  template: `<div class="request-feedback-stub"></div>`
})
