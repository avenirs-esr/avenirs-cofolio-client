import type { PropType } from 'vue'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'

export const ActivityRecommendedCompletionContextsFormFieldStub = defineComponent({
  name: 'ActivityRecommendedCompletionContextsFormField',
  props: {
    form: {
      type: Object as PropType<EditActivityForm>,
    },
  },
  template: '<div data-testid="activity-recommended-completion-contexts-form-field-stub"></div>',
})
