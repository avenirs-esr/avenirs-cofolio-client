import type { AddActivityResourceForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'

export const AddActivityResourceNameInputFormFieldStub = defineComponent({
  name: 'AddActivityResourceNameInputFormField',
  props: {
    form: {
      type: Object as PropType<AddActivityResourceForm>,
    },
  },
  template: '<div data-testid="add-activity-resource-name-input-form-field-stub"></div>',
})
