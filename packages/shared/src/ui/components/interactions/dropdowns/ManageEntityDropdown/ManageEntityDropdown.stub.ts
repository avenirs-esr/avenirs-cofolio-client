import type { Action, ActionItem } from '#shared/ui/components/interactions/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import type { PropType } from 'vue'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'
import { defineComponent } from 'vue'

export const ManageEntityDropdownStub = defineComponent({
  name: 'ManageEntityDropdown',
  props: {
    ...AvInteractivePropsStub,
    entityName: {
      type: String,
      required: true
    },
    actions: {
      type: Array as PropType<(Action | ActionItem)[]>,
      required: true,
    },
    icon: {
      type: String,
      default: undefined,
    },
    iconOnly: {
      type: Boolean,
      default: false,
    },
    triggerSize: {
      type: String,
      default: 'MD',
    },
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
