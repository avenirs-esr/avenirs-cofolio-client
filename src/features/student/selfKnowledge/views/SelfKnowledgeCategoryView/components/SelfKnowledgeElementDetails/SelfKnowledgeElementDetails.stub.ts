import type { ESelfKnowledgeCategory, SelfKnowledgeElementDetailsDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const SelfKnowledgeElementDetailsStub = defineComponent({
  name: 'SelfKnowledgeElementDetails',
  props: {
    element: Object as PropType<SelfKnowledgeElementDetailsDTO>,
    category: String as PropType<ESelfKnowledgeCategory>
  },
  template: '<div data-testid="self-knowledge-element-details" />'
})
