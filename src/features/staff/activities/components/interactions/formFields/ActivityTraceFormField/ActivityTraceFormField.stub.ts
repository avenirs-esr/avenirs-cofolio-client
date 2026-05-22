import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'

export const ActivityTraceFormFieldStub = defineComponent({
  name: 'ActivityTraceFormField',
  props: {
    form: {
      type: Object as PropType<EditActivityForm>,
    },
  },
  template: '<div data-testid="activity-trace-form-field-stub"></div>',
})
