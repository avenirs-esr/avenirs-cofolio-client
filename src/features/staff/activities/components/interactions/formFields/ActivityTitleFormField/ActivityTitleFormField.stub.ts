import type { ActivityDraftCreationForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'

export const ActivityTitleFormFieldStub = defineComponent({
  name: 'ActivityTitleFormField',
  props: {
    form: {
      type: Object as PropType<ActivityDraftCreationForm>,
    },
    isTextarea: {
      type: Boolean,
    },
  },
  template: '<div data-testid="activity-title-form-field-stub"></div>',
})
