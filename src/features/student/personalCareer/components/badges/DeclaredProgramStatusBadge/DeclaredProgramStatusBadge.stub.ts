import type { EProgramStatus } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const DeclaredProgramStatusBadgeStub = defineComponent({
  name: 'DeclaredProgramStatusBadge',
  props: {
    status: {
      type: String as PropType<EProgramStatus>,
      required: true
    }
  },
  template: '<div data-testid="declared-program-status-badge-stub">{{ status }}</div>'
})
