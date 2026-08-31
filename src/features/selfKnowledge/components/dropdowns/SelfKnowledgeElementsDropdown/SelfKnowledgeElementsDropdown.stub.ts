import type { ESelfKnowledgeCategory } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const SelfKnowledgeElementsDropdownStub = defineComponent({
  name: 'SelfKnowledgeElementsDropdown',
  props: {
    categoryType: {
      type: String as PropType<ESelfKnowledgeCategory>,
      required: true
    }
  },
  template: '<div data-testid="self-knowledge-elements-dropdown" />'
})
