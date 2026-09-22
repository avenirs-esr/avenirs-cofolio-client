import type { EAssociationContextType } from '@/api/avenir-esr'
import type { AssociationSelections } from '@/features/student/associations/types/associations.types'
import type { PropType } from 'vue'

export const AssociationSelectionSectionStub = defineComponent({
  name: 'AssociationSelectionSection',
  props: {
    contextType: { type: String as PropType<EAssociationContextType>, required: true },
    associatedContextTypes: { type: Array as PropType<EAssociationContextType[]>, default: undefined },
    enabled: { type: Boolean, default: true },
    layout: { type: String as PropType<'vertical' | 'horizontal'>, default: 'horizontal' },
    selections: { type: Object as PropType<AssociationSelections>, default: () => ({}) }
  },
  emits: ['update:selections'],
  template: '<div data-testid="association-selection-section-stub" />'
})
