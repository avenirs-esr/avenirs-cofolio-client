import type { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

export const DeleteAssociationsModalStub = defineComponent({
  name: 'DeleteAssociationsModal',
  props: {
    opened: { type: Boolean, required: true },
    contextType: { type: String as PropType<EAssociationContextType>, required: true },
    elementId: { type: String, required: true },
  },
  emits: ['cancel', 'deleted'],
  template: '<div data-testid="delete-associations-modal-stub" />'
})
