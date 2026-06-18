import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const FeedbackInfoCardStub = defineComponent({
  name: 'FeedbackInfoCard',
  props: {
    activity: {
      type: Object as PropType<DeclaredActivityDetailsDTO>,
      required: true
    }
  },
  template: '<div data-testid="feedback-info-card" />'
})
