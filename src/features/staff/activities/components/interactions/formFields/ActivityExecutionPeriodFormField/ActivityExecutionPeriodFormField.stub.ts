import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'

export const ActivityExecutionPeriodFormFieldStub = defineComponent({
  name: 'ActivityExecutionPeriodFormField',
  props: {
    form: {
      type: Object as PropType<EditActivityForm>,
    },
    disabled: {
      type: Boolean,
      required: false
    }
  },
  emits: ['autosave', 'updateExecutionPeriodEnabled'],
  template: '<div data-testid="activity-execution-period-form-field-stub"></div>',
})
