import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { AssociationLimits } from '@/features/student/associations/types/associations.types'
import type { PropType } from 'vue'

export const ElementAssociationsStub = defineComponent({
  name: 'ElementAssociations',
  props: {
    contextType: { type: String as PropType<EAssociationContextType>, required: true },
    elementId: { type: String, required: true },
    associations: { type: Object as PropType<AssociationsDTO>, default: undefined },
    error: { type: Object, default: null },
    isLoading: { type: Boolean, default: false },
    associatedContextTypes: { type: Array as PropType<EAssociationContextType[]>, default: undefined },
    limits: { type: Object as PropType<AssociationLimits>, default: undefined },
    readonly: { type: Boolean, default: false },
    actionsDisabled: { type: Boolean, default: false }
  },
  template: `
    <div data-testid="element-associations-stub">
      <slot name="actions-footer" />
      <slot name="header" />
    </div>
  `
})
