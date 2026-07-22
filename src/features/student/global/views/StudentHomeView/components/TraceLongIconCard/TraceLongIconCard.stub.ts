import type { TraceOverviewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const TraceLongIconCardStub = defineComponent({
  name: 'TraceLongIconCard',
  props: {
    trace: {
      type: Object as PropType<TraceOverviewDTO>,
      required: false
    },
  },
  template: '<div data-testid="trace-long-icon-card-stub"></div>'
})
