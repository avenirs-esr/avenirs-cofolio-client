import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const ActivityFeedbackFormFieldStub = defineComponent({
  name: 'ActivityFeedbackFormField',
  props: {
    ...AvInteractivePropsStub,
    form: {
      type: Object as PropType<EditActivityForm>,
    },
  },
  template: '<div data-testid="activity-feedback-form-field-stub"></div>',
})
