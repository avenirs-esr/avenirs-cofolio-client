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
  emits: ['add', 'delete', 'deleteCategory'],
  template: '<div data-testid="self-knowledge-elements-dropdown" />'
})
