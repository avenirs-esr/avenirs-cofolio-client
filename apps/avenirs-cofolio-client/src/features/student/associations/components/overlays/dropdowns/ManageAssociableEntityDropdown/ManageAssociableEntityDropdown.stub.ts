import type { AvInteractiveProps } from '@avenirs-esr/avenirs-dsav'
import type { EAssociationContextType } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'
import type { ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'

export const ManageAssociableEntityDropdownStub = defineComponent({
  name: 'ManageAssociableEntityDropdown',
  props: {
    entityName: { type: String, required: true },
    contextType: { type: String as PropType<EAssociationContextType>, required: true },
    elementId: { type: String, required: true },
    actions: { type: Array as PropType<(Action | ActionItem)[]>, default: () => [] },
    associationInteractiveProps: { type: Object as PropType<AvInteractiveProps>, default: () => ({}) },
    dissociationInteractiveProps: { type: Object as PropType<AvInteractiveProps>, default: () => ({}) },
  },
  emits: Object.values(Action),
  computed: {
    resolvedActions () {
      return this.actions.map(action =>
        typeof action === 'string' ? { type: action } : action
      )
    },
  },
  template: `
    <div data-testid="manage-associable-entity-dropdown-stub">
      <button
        v-for="action in resolvedActions"
        :key="action.type"
        :data-testid="action.type"
        :disabled="action.disabled"
        @click="$emit(action.type)"
      >
        {{ action.type }}
      </button>
    </div>
  `,
})
