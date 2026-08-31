import type { FeedbackOverviewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

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
