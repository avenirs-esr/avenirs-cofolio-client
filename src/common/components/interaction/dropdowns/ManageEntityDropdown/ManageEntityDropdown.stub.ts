import type { Action, ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import type { PropType } from 'vue'

export const ManageEntityDropdownStub = defineComponent({
  name: 'ManageEntityDropdown',
  props: {
    entityName: String,
    actions: {
      type: Array as PropType<(Action | ActionItem)[]>,
      required: true,
    },
    icon: String,
    iconOnly: Boolean
  },
  emits: ['actionSelected'],
  computed: {
    resolvedActions () {
      return this.actions.map(action => (typeof action === 'string' ? { type: action } : action))
    }
  },
  template: `
    <div data-testid="manage-entity-dropdown-stub">
      <button
        v-for="action in resolvedActions"
        :key="action.type"
        :data-testid="action.type"
        :disabled="action.disabled"
        @click="$emit('actionSelected', action.type)"
      >
        {{ action.type }}
      </button>
    </div>
  `
})
