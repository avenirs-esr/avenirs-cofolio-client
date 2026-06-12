import type { FeedbackStaffListItemDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const FeedbackCardStub = defineComponent({
  name: 'FeedbackCard',
  template: '<div data-testid="feedback-card-stub"></div>',
  props: {
    feedback: {
      type: Object as PropType<FeedbackStaffListItemDTO>,
      required: true,
    },
  },
})
