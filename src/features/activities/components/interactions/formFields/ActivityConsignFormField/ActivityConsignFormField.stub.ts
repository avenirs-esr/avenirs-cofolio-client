import type { EditActivityForm } from '@/features/activities/types/forms.types'
import type { PropType } from 'vue'

export const ActivityConsignFormFieldStub = defineComponent({
  name: 'ActivityConsignFormField',
  props: {
    form: {
      type: Object as PropType<EditActivityForm>,
    },
  },
  template: '<div data-testid="activity-consign-form-field-stub"></div>',
})
