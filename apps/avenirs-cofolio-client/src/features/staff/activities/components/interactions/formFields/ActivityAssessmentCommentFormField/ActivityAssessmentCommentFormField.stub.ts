import type { PropType } from 'vue'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const ActivityAssessmentCommentFormFieldStub = defineComponent({
  name: 'ActivityAssessmentCommentFormField',
  props: {
    ...AvInteractivePropsStub,
    form: {
      type: Object as PropType<EditActivityForm>,
      required: true,
    },
  },
  emits: ['change'],
  template: '<div data-testid="activity-assessment-comment-form-field-stub"></div>',
})
