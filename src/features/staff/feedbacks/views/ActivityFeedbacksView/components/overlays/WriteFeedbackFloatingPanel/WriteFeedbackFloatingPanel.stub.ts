import type { FeedbackDetailsDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const WriteFeedbackFloatingPanelStub = defineComponent({
  name: 'WriteFeedbackFloatingPanel',
  props: {
    feedback: {
      type: Object as PropType<FeedbackDetailsDTO>,
      required: true,
    },
    activityTitle: {
      type: String,
      required: true,
    },
  },
  template: '<div data-testid="write-feedback-floating-panel-stub" />',
})
