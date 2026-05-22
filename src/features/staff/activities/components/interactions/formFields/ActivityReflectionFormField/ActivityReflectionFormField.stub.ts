import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'

export const ActivityReflectionFormFieldStub = defineComponent({
  name: 'ActivityReflectionFormField',
  props: {
    form: {
      type: Object as PropType<EditActivityForm>,
    },
  },
  template: '<div data-testid="activity-reflection-form-field-stub"></div>',
})
