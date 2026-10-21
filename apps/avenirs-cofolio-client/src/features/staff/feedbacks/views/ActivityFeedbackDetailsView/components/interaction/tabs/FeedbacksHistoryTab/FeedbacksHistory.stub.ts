import type { PropType } from 'vue'
import type { FeedbackOverviewDTO } from '@/api/avenir-esr'

export const FeedbacksHistoryTabStub = defineComponent({
  name: 'FeedbacksHistoryTab',
  props: {
    feedbacks: {
      type: Array as PropType<FeedbackOverviewDTO[]>,
      required: true,
    },
    maxIterations: {
      type: Number,
      required: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: Object,
      default: null,
    },
  },
  template: '<div data-testid="feedbacks-history-tab-stub" />',
})
