import type { PropType } from 'vue'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const ActivityAssessmentFormFieldsContainerStub = defineComponent({
  name: 'ActivityAssessmentFormFieldsContainer',
  props: {
    ...AvInteractivePropsStub,
    form: {
      type: Object as PropType<EditActivityForm>,
      required: true,
    },
  },
  emits: ['autosave', 'updateAssessmentEnabled', 'updateGradeEnabled'],
  template: '<div data-testid="activity-assessment-form-fields-container-stub"></div>',
})
