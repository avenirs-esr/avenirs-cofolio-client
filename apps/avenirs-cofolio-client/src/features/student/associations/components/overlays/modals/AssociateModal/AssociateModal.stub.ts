import type { PropType } from 'vue'
import type { EAssociationContextType } from '@/api/avenir-esr'

export const AssociateModalStub = defineComponent({
  name: 'AssociateModal',
  props: {
    opened: { type: Boolean, required: true },
    contextType: { type: String as PropType<EAssociationContextType>, required: true },
    elementId: { type: String, required: true },
    associatedContextType: { type: String as PropType<EAssociationContextType>, required: true }
  },
  emits: ['cancel', 'associated'],
  template: '<div data-testid="associate-modal-stub" />'
})
