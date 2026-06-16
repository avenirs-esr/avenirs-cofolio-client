import type { EDeclaredActivityStatus } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeclaredActivityStatusBadgeStub = defineComponent({
  name: 'DeclaredActivityStatusBadge',
  props: {
    status: {
      type: String as PropType<EDeclaredActivityStatus>,
      required: true
    }
  },
  template: `<div :data-status="status" data-testid="declared-activity-status-badge">{{ status }}</div>`
})
