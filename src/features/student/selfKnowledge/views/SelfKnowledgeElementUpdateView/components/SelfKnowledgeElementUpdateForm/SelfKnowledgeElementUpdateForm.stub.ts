import type { ESelfKnowledgeCategory, SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

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
