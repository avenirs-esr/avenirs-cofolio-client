import type { PropType } from 'vue'
import type { EProgramStatus } from '@/api/avenir-esr'

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
