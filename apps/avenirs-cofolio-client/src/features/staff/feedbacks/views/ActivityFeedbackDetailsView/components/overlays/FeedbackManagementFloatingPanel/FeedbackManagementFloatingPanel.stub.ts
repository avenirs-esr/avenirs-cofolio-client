import type { PropType } from 'vue'
import type { FeedbackDetailsDTO } from '@/api/avenir-esr'

export const FeedbackManagementFloatingPanelStub = defineComponent({
  name: 'FeedbackManagementFloatingPanel',
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
