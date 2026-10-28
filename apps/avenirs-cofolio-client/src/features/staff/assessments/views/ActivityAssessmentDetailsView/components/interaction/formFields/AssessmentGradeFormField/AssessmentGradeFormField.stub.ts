import type { PropType } from 'vue'
import type { WriteAssessmentFormApi } from '@/features/staff/assessments/types/forms.types'

export const AssessmentGradeFormFieldStub = defineComponent({
  name: 'AssessmentGradeFormField',
  props: {
    form: {
      type: Object as PropType<WriteAssessmentFormApi>,
      required: true
    },
    maxGrade: {
      type: Number,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  template: '<div data-testid="assessment-grade-form-field" />'
})
