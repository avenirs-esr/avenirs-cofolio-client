import type { PropType } from 'vue'
import type { DisabledState } from '@/common/components/interaction/dropdowns/ManageAssociableEntityDropdown/ManageAssociableEntityDropdown.types'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'

export const ManageAssociableEntityDropdownStub = defineComponent({
  name: 'ManageAssociableEntityDropdown',
  props: {
    elementId: { type: String, required: true },
    contextType: { type: String, required: true },
    hasAssociations: { type: Boolean, required: true },
    associateOverride: { type: Object as PropType<DisabledState>, required: false }
  },
  setup (props, { slots }) {
    const associateAction = { type: Action.ASSOCIATE, label: 'Associer', ...(props.associateOverride ?? {}) }
    const dissociateAction = { type: Action.DISSOCIATE, label: 'Dissocier', disabled: !props.hasAssociations }
    const handleAction = () => {}
    return () => slots.default?.({ associateAction, dissociateAction, handleAction })
  }

})
