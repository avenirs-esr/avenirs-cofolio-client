import type { PropType } from 'vue'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'

export const ActivityTargetsFormFieldStub = defineComponent({
  name: 'ActivityTargetsFormField',
  props: {
    form: {
      type: Object as PropType<EditActivityForm>,
    },
    persistedIds: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    lockPersisted: Boolean,
  },
  template: '<div data-testid="activity-targets-form-field-stub"></div>',
})
