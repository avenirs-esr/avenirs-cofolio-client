import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const AssociatedElementsCardStub = defineComponent({
  name: 'AssociatedElementsCard',
  props: {
    ...AvInteractivePropsStub,
    associatedContextType: { type: String as PropType<EAssociationContextType>, required: true },
    associations: { type: Object as PropType<AssociationsDTO>, required: true },
    limit: { type: Number, default: undefined },
  },
  template: '<div data-testid="associated-elements-card-stub" />'
})
