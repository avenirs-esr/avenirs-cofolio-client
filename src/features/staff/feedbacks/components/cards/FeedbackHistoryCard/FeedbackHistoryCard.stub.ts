import type { FeedbackOverviewDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const FeedbackHistoryCardStub = defineComponent({
  name: 'FeedbackHistoryCard',
  props: {
    feedback: {
      type: Object as PropType<FeedbackOverviewDTO>,
      required: true,
    },
    iteration: {
      type: Number,
      required: true,
    },
    maxIterations: {
      type: Number,
      required: false,
    },
    collapsed: {
      type: Boolean,
      default: true,
    },
  },
  template: '<div data-testid="feedback-history-card-stub" />',
})
