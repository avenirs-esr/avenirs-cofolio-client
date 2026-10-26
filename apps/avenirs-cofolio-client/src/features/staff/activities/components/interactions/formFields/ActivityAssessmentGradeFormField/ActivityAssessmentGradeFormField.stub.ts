import type { PropType } from 'vue'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const ActivityAssessmentGradeFormFieldStub = defineComponent({
  name: 'ActivityAssessmentGradeFormField',
  props: {
    ...AvInteractivePropsStub,
    form: {
      type: Object as PropType<EditActivityForm>,
      required: true,
    },
  },
  emits: ['change', 'updateGradeEnabled'],
  template: '<div data-testid="activity-assessment-grade-form-field-stub"></div>',
})
