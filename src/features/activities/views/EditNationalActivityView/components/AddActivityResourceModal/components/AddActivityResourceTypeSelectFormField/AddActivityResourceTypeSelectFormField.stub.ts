import type { AddActivityResourceForm } from '@/features/activities/types/forms.types'
import type { PropType } from 'vue'

export const AddActivityResourceTypeSelectFormFieldStub = defineComponent({
  name: 'AddActivityResourceTypeSelectFormField',
  props: {
    form: {
      type: Object as PropType<AddActivityResourceForm>,
    },
  },
  emits: ['change'],
  template: '<div data-testid="add-activity-resource-type-select-form-field-stub"></div>',
})
