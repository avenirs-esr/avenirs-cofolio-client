import type { FeedbackDetailsDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const WriteFeedbackTabStub = defineComponent({
  name: 'WriteFeedbackTab',
  props: {
    feedback: { type: Object as PropType<FeedbackDetailsDTO>, required: false },
    readonly: { type: Boolean, required: false, default: false },
  },
  emits: ['cancel', 'feedbackSent'],
  template: '<div data-testid="write-feedback-tab-stub" />',
})
