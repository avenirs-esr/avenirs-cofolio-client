import type { PropType } from 'vue'
import type { FeedbackStaffListItemDTO } from '@/api/avenir-esr'

export const FeedbackLongIconCardStub = defineComponent({
  name: 'FeedbackLongIconCard',
  props: {
    feedack: {
      type: Object as PropType<FeedbackStaffListItemDTO>,
      required: false
    },
  },
  template: '<div data-testid="feedback-long-icon-card-stub"></div>'
})
