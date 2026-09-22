import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const AssociationsSelectorStub = defineComponent({
  name: 'AssociationsSelector',
  props: {
    associatedContextType: { type: String as PropType<EAssociationContextType>, required: true },
    associations: { type: Object as PropType<AssociationsDTO>, required: true },
    readonly: { type: Boolean, default: false },
    modelValue: { type: Array as PropType<string[]>, default: () => [] }
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="associations-selector-stub" />'
})
