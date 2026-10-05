import type { AddSelfKnowledgeCategoryElementForm, UpdateSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/types/forms.types'
import type { PropType } from 'vue'

export const CategoryElementTitleInputFormFieldStub = defineComponent({
  name: 'CategoryElementTitleInputFormField',
  props: {
    form: Object as PropType<AddSelfKnowledgeCategoryElementForm | UpdateSelfKnowledgeCategoryElementForm>
  },
  template: '<div class="title-input-stub"></div>'
})
