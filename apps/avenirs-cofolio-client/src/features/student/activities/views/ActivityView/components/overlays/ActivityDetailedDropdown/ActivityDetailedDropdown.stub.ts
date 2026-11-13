import type { EActivityStatus, EDeclaredActivityStatus } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'

export const ActivityDetailedDropdownStub = defineComponent({
  name: 'ActivityDetailedDropdown',
  props: {
    declaredActivityId: { type: String, required: true },
    status: { type: String as PropType<EDeclaredActivityStatus>, required: true },
    activityStatus: { type: String as PropType<EActivityStatus>, required: true },
  },
  emits: [
    Action.UPDATE,
    Action.UNSUBSCRIBE,
    Action.RESUBSCRIBE,
    Action.DELETE,
  ],
  template: `
    <div data-testid="activity-detailed-dropdown-stub">
      <button data-testid="update" @click="$emit('${Action.UPDATE}')">
        ${Action.UPDATE}
      </button>
      <button data-testid="unsubscribe" @click="$emit('${Action.UNSUBSCRIBE}')">
        ${Action.UNSUBSCRIBE}
      </button>
      <button data-testid="resubscribe" @click="$emit('${Action.RESUBSCRIBE}')">
        ${Action.RESUBSCRIBE}
      </button>
      <button data-testid="delete" @click="$emit('${Action.DELETE}')">
        ${Action.DELETE}
      </button>
    </div>
  `,
})
