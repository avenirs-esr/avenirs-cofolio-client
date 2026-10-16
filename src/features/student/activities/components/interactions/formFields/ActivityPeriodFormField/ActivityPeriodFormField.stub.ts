import type { Component, PropType } from 'vue'
import type { UpdateActivityForm } from '@/features/student/global/types/forms.types'

export const ActivityPeriodFormFieldStub: Component = defineComponent({
  name: 'ActivityPeriodFormField',
  template: '<div data-testid="activity-period-form-field-stub"></div>',
  props: {
    form: {
      type: Object as PropType<UpdateActivityForm>,
    },
    label: {
      type: String,
    },
  },
})
