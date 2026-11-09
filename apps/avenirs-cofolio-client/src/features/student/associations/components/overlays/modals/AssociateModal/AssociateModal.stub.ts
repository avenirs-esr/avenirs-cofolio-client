import type { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const AssociateModalStub = defineComponent({
  name: 'AssociateModal',
  props: {
    opened: { type: Boolean, required: true },
    contextType: { type: String as PropType<EAssociationContextType>, required: true },
    elementId: { type: String, required: true },
  },
  emits: ['cancel', 'associated'],
  template: '<div data-testid="associate-modal-stub" />'
})
