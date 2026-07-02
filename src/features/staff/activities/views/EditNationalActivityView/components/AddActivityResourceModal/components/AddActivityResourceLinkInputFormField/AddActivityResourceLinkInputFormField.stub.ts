import type { AddActivityResourceForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'

export const AddActivityResourceLinkInputFormFieldStub = defineComponent({
  name: 'AddActivityResourceLinkInputFormField',
  props: {
    form: {
      type: Object as PropType<AddActivityResourceForm>,
    },
  },
  template: '<div data-testid="add-activity-resource-link-input-form-field-stub"></div>',
})
