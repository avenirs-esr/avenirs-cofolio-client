import type { PropType } from 'vue'
import type { ESelfKnowledgeCategory, SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'

export const SelfKnowledgeElementUpdateFormStub = defineComponent({
  name: 'SelfKnowledgeElementUpdateForm',
  props: {
    element: {
      type: Object as PropType<SelfKnowledgeElementDetailsDTO>,
      required: true
    },
    onCancel: {
      type: Function,
      required: false
    },
    category: {
      type: String as PropType<ESelfKnowledgeCategory>,
      required: false
    }
  },
  template: '<div class="self-knowledge-element-update-form-stub" />'
})
