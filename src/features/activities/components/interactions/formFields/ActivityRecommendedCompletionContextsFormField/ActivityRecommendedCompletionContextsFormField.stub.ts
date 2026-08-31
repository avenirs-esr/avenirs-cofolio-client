import type { EditActivityForm } from '@/features/activities/types/forms.types'
import type { PropType } from 'vue'

export const ActivityRecommendedCompletionContextsFormFieldStub = defineComponent({
  name: 'ActivityRecommendedCompletionContextsFormField',
  props: {
    form: {
      type: Object as PropType<EditActivityForm>,
    },
  },
  template: '<div data-testid="activity-recommended-completion-contexts-form-field-stub"></div>',
})
