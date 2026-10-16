import type { PropType } from 'vue'
import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { AssociationLimitState } from '@/features/student/associations/composables/use-association-limit/use-association-limit'
import { UNKNOWN_ASSOCIATION_LIMIT } from '@/features/student/associations/composables/use-association-limit/use-association-limit'

export function createElementAssociationsStub (getLimit: (associatedContextType: EAssociationContextType) => AssociationLimitState) {
  return defineComponent({
    name: 'ElementAssociations',
    props: {
      contextType: { type: String as PropType<EAssociationContextType>, required: true },
      elementId: { type: String, required: true },
      associations: { type: Object as PropType<AssociationsDTO>, default: undefined },
      error: { type: Object, default: null },
      isLoading: { type: Boolean, default: false },
      actionsDisabled: { type: Boolean, default: false },
      actionsDisabledTooltip: { type: String, default: undefined }
    },
    setup: () => ({ getLimit }),
    template: `
    <div data-testid="element-associations-stub">
     <slot name="header" :getLimit="getLimit" />
    </div>
  `
  })
}

export const ElementAssociationsStub = createElementAssociationsStub(() => UNKNOWN_ASSOCIATION_LIMIT)
