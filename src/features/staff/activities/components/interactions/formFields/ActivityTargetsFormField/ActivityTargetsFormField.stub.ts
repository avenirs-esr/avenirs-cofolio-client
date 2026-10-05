import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'

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
