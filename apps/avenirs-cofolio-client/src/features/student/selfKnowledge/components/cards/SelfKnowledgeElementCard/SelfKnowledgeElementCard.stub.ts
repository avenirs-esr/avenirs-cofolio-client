import type { SelfKnowledgeElementViewDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const SelfKnowledgeElementCardStub = defineComponent({
  name: 'SelfKnowledgeElementCard',
  props: {
    element: {
      type: Object as PropType<SelfKnowledgeElementViewDTO>,
      required: true
    },
    categoryType: {
      type: String,
      required: true
    },
    categoryColor: {
      type: String
    }
  },
  template: '<div data-testid="self-knowledge-element-card" />'
})
