import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const ActivityReflectionFormFieldStub = defineComponent({
  name: 'ActivityReflectionFormField',
  props: {
    ...AvInteractivePropsStub,
    form: {
      type: Object as PropType<EditActivityForm>,
    },
  },
  template: '<div data-testid="activity-reflection-form-field-stub"></div>',
})
