import type { WriteFeedbackFormApi } from '@/features/staff/feedbacks/types/forms.types'
import type { PropType } from 'vue'

export const FeedbackAttachmentsFormFieldStub = defineComponent({
  name: 'FeedbackAttachmentsFormField',
  props: {
    form: {
      type: Object as PropType<WriteFeedbackFormApi>,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  template: '<div data-testid="feedback-attachments-form-field" />'
})
