import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'

export const ActivityExecutionPeriodFormFieldStub = defineComponent({
  name: 'ActivityExecutionPeriodFormField',
  props: {
    form: {
      type: Object as PropType<EditActivityForm>,
    },
  },
  template: '<div data-testid="activity-consign-form-field-stub"></div>',
})
