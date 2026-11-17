import type { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'
import type { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'

export const ManageAssociationModalStub = defineComponent({
  name: 'ManageAssociationModal',
  props: {
    opened: {
      type: Boolean,
      required: true
    },
    contextType: {
      type: String as PropType<EAssociationContextType>,
      required: true
    },
    elementId: {
      type: String,
      required: true
    },
    mode: {
      type: String as PropType<Action.ASSOCIATE | Action.DISSOCIATE>,
      required: true
    }
  },
  emits: ['cancel', 'associated', 'dissociated'],
  template: '<div data-testid="manage-association-modal-stub" />'
})
