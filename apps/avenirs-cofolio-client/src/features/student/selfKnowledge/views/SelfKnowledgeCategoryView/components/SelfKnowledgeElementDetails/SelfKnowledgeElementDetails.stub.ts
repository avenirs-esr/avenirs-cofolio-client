import type { PropType } from 'vue'
import type { ESelfKnowledgeCategory, SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'

export const SelfKnowledgeElementDetailsStub = defineComponent({
  name: 'SelfKnowledgeElementDetails',
  props: {
    element: Object as PropType<SelfKnowledgeElementDetailsDTO>,
    category: String as PropType<ESelfKnowledgeCategory>
  },
  template: '<div data-testid="self-knowledge-element-details" />'
})
