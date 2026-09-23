import type { EDeclaredActivityStatus } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityDetailedDropdownStub = defineComponent({
  name: 'ActivityDetailedDropdown',
  props: {
    status: {
      type: String as PropType<EDeclaredActivityStatus>,
      required: true
    }
  },
  emits: ['update', 'unsubscribe', 'resubscribe', 'delete'],
  template: '<div class="activity-detailed-dropdown-stub" />'
})
