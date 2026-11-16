import type { AvDropdownProps } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'
import type { Action, ActionItem } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { AvInteractivePropsStub } from '@avenirs-esr/avenirs-dsav/test-utils'

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
      type: String as PropType<AvDropdownProps['triggerSize']>,
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
