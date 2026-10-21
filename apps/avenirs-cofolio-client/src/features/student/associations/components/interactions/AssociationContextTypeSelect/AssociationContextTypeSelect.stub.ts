import type { PropType } from 'vue'
import type { EAssociationContextType } from '@/api/avenir-esr'

export const AssociationContextTypeSelectStub = defineComponent({
  name: 'AssociationContextTypeSelect',
  props: {
    contextTypes: {
      type: Array as PropType<EAssociationContextType[]>,
      required: true
    },
    modelValue: {
      type: String as PropType<EAssociationContextType>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="association-context-type-select-stub" />'
})
