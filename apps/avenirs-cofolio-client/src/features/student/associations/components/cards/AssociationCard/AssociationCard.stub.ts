import type { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

export const AssociationCardStub = defineComponent({
  name: 'AssociationCard',
  props: {
    ...AvInteractivePropsStub,
    title: {
      type: String,
      required: true
    },
    contextType: {
      type: String as PropType<EAssociationContextType>,
      required: true
    },
    to: {
      type: [String, Object],
      required: true
    },
  },
  template: '<div data-testid="association-card"><slot name="body" /><slot name="footer" /></div>'
})
