import type { TraceDetailDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { PropType } from 'vue'

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
