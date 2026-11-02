import type { PropType } from 'vue'
import type { WriteAssessmentFormApi } from '@/features/staff/assessments/types/forms.types'

export const AssessmentValidationFormFieldStub = defineComponent({
  name: 'AssessmentValidationFormField',
  props: {
    form: {
      type: Object as PropType<WriteAssessmentFormApi>,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  template: '<div data-testid="assessment-validation-form-field" />'
})
