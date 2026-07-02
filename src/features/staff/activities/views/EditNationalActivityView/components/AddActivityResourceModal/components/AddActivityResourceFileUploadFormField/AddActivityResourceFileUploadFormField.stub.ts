import type { AddActivityResourceForm } from '@/features/staff/activities/types/forms.types'
import type { PropType } from 'vue'

export const AddActivityResourceFileUploadFormFieldStub = defineComponent({
  name: 'AddActivityResourceFileUploadFormField',
  props: {
    form: {
      type: Object as PropType<AddActivityResourceForm>,
    },
  },
  emits: ['fileSelected', 'fileDeleted'],
  template: '<div data-testid="add-activity-resource-file-upload-form-field-stub"></div>',
})
