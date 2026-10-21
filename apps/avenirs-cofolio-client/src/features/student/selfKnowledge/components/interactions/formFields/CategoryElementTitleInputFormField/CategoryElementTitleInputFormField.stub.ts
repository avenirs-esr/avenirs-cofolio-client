import type { PropType } from 'vue'
import type { AddSelfKnowledgeCategoryElementForm, UpdateSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/types/forms.types'

export const CategoryElementTitleInputFormFieldStub = defineComponent({
  name: 'CategoryElementTitleInputFormField',
  props: {
    form: Object as PropType<AddSelfKnowledgeCategoryElementForm | UpdateSelfKnowledgeCategoryElementForm>
  },
  template: '<div class="title-input-stub"></div>'
})
