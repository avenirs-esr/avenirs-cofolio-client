import type { PropType } from 'vue'
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'

export const FeedbackInfoCardStub = defineComponent({
  name: 'FeedbackInfoCard',
  props: {
    activity: {
      type: Object as PropType<DeclaredActivityDetailsDTO>,
      required: true
    },
    showAdditionalInfo: {
      type: Boolean,
      default: true
    }
  },
  template: '<div data-testid="feedback-info-card" />'
})
