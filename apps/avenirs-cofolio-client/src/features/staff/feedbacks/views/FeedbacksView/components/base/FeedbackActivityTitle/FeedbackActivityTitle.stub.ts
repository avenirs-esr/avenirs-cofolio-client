import type { PropType } from 'vue'
import type { EFeedbackStatus } from '@/api/avenir-esr'

export const FeedbackActivityTitle = defineComponent({
  name: 'FeedBackActivityTitleStub',
  props: {
    feedback: {
      type: Object as PropType<{ id: string, status?: EFeedbackStatus }>,
      required: true,
    },
    activity: Object as PropType<{ id?: string, title: string }>,
    withNav: {
      type: Boolean,
      default: false,
    }
  },
  template: '<div data-testid="feedback-activity-title">{{ feedback.title }}</div>',
})
