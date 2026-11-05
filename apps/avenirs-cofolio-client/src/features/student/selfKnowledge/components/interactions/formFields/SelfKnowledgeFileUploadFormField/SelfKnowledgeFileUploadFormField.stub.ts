import type { PropType } from 'vue'
import type { AddSelfKnowledgeCategoryElementForm, UpdateSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/types/forms.types'

export const SelfKnowledgeFileUploadFormFieldStub = defineComponent({
  name: 'SelfKnowledgeFileUploadFormField',
  props: {
    form: {
      type: Object as PropType<
        AddSelfKnowledgeCategoryElementForm
        | UpdateSelfKnowledgeCategoryElementForm
      >,
      required: false
    }
  },
  template: '<div data-testid="self-knowledge-file-upload-form-field-stub" />'
})
