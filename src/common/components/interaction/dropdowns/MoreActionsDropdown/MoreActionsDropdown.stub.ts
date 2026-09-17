import type { Action, ActionItem } from '@/common/components/interaction/dropdowns/MoreActionsDropdown/MoreActionsDropdown.types'
import type { PropType } from 'vue'

export const MoreActionsDropdownStub = defineComponent({
  name: 'MoreActionsDropdown',
  props: {
    entityName: String,
    actions: {
      type: Array as PropType<(Action | ActionItem)[]>,
      required: true,
    }
  },
  emits: ['actionSelected'],
  computed: {
    resolvedActions () {
      return this.actions.map(action => (typeof action === 'string' ? { type: action } : action))
    }
  },
  template: `
    <div data-testid="more-actions-dropdown-stub">
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
