import type { PropType } from 'vue'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'

export const ActivitySummaryFormFieldStub = defineComponent({
  name: 'ActivitySummaryFormField',
  props: {
    form: {
      type: Object as PropType<EditActivityForm>,
    },
  },
  template: '<div data-testid="activity-summary-form-field-stub"></div>',
})
