import type { PropType } from 'vue'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'

export const ActivityTargetsFormFieldStub = defineComponent({
  name: 'ActivityTargetsFormField',
  props: {
    form: {
      type: Object as PropType<EditActivityForm>,
    },
  },
  template: '<div data-testid="activity-targets-form-field-stub"></div>',
})
