import type { PropType } from 'vue'
import type { WriteAssessmentFormApi } from '@/features/staff/assessments/types/forms.types'

export const AssessmentCommentFormFieldStub = defineComponent({
  name: 'AssessmentCommentFormField',
  props: {
    form: {
      type: Object as PropType<WriteAssessmentFormApi>,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  template: '<div data-testid="assessment-comment-form-field" />'
})
