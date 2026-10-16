import type { PropType } from 'vue'
import type { ActivityDraftCreationForm, ActivityDuplicationForm, EditActivityForm } from '@/features/staff/activities/types/forms.types'

export const ActivityTitleFormFieldStub = defineComponent({
  name: 'ActivityTitleFormField',
  props: {
    form: {
      type: Object as PropType<ActivityDraftCreationForm | ActivityDuplicationForm | EditActivityForm>,
    },
    labelVisible: {
      type: Boolean,
      required: false
    },
  },
  template: '<div data-testid="activity-title-form-field-stub"></div>',
})
