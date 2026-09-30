import type { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import type { AddSelfKnowledgeCategoryElementForm, UpdateSelfKnowledgeCategoryElementForm } from '@/features/student/selfKnowledge/types/forms.types'
import type { PropType } from 'vue'

export const CategoryElementTitleInputFormFieldStub = defineComponent({
  name: 'CategoryElementTitleInputFormField',
  props: {
    form: Object as PropType<AddSelfKnowledgeCategoryElementForm | UpdateSelfKnowledgeCategoryElementForm>,
    category: String as PropType<ESelfKnowledgeCategory>
  },
  template: '<div class="title-input-stub"></div>'
})
