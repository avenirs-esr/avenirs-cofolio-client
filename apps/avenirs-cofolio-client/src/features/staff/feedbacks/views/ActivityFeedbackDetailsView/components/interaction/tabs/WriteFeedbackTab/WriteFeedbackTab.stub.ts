import type { PropType } from 'vue'
import type { FeedbackDetailsDTO } from '@/api/avenir-esr'

export const WriteFeedbackTabStub = defineComponent({
  name: 'WriteFeedbackTab',
  props: {
    feedback: {
      type: Object as PropType<FeedbackDetailsDTO>,
      required: true
    }
  },
  emits: ['cancel', 'feedbackSaved', 'feedbackSent'],
  template: '<div data-testid="write-feedback-tab-stub" />',
})
