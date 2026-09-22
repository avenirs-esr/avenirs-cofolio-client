import type { AssociationsDTO, EAssociationContextType } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeleteAssociationsModalStub = defineComponent({
  name: 'DeleteAssociationsModal',
  props: {
    opened: { type: Boolean, required: true },
    contextType: { type: String as PropType<EAssociationContextType>, required: true },
    elementId: { type: String, required: true },
    associatedContextType: { type: String as PropType<EAssociationContextType>, required: true },
    associations: { type: Object as PropType<AssociationsDTO>, required: true }
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-associations-modal-stub" />'
})
