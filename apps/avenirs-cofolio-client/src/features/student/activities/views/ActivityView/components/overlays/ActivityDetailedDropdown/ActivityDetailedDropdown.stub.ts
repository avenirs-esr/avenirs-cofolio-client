import type { PropType } from 'vue'
import type { EDeclaredActivityStatus } from '@/api/avenir-esr'

export const ActivityDetailedDropdownStub = defineComponent({
  name: 'ActivityDetailedDropdown',
  props: {
    status: {
      type: String as PropType<EDeclaredActivityStatus>,
      required: true
    }
  },
  emits: ['update', 'unsubscribe', 'resubscribe', 'delete', 'associate', 'dissociate'],
  template: '<div class="activity-detailed-dropdown-stub" />'
})
