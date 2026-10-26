import type { PropType } from 'vue'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const ActivityAssessmentValidationFormFieldStub = defineComponent({
  name: 'ActivityAssessmentValidationFormField',
  props: {
    ...AvInteractivePropsStub,
    form: {
      type: Object as PropType<EditActivityForm>,
      required: true,
    },
  },
  emits: ['change'],
  template: '<div data-testid="activity-assessment-validation-form-field-stub"></div>',
})
