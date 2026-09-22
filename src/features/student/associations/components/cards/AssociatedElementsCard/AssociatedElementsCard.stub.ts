import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const AssociatedElementsCardStub = defineComponent({
  name: 'AssociatedElementsCard',
  props: {
    associatedContextType: { type: String as PropType<EAssociationContextType>, required: true },
    associations: { type: Object as PropType<AssociationsDTO>, required: true },
    limit: { type: Number, default: undefined },
    disabled: { type: Boolean, default: false }
  },
  template: '<div data-testid="associated-elements-card-stub" />'
})
