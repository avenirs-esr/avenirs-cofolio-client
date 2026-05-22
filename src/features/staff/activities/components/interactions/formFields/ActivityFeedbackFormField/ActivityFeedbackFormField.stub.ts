import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'

export const ActivityFeedbackFormFieldStub = defineComponent({
  name: 'ActivityFeedbackFormField',
  props: {
    form: {
      type: Object as PropType<EditActivityForm>,
    },
  },
  template: '<div data-testid="activity-feedback-form-field-stub"></div>',
})
