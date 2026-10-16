import type { PropType } from 'vue'
import type { TraceDetailDTO } from '@/api/avenir-esr'

export const FeedbackTraceActionsStub = defineComponent({
  name: 'FeedbackTraceActions',
  template: '<div data-testid="feedback-trace-actions-stub"></div>',
  props: {
    trace: {
      type: Object as PropType<TraceDetailDTO>,
      required: true,
    },
  },
})
