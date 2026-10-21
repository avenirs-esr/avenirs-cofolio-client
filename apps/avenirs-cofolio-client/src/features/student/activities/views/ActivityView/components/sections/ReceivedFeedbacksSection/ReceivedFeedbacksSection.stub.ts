import type { PropType } from 'vue'
import type { DeclaredActivityDetailsDTO } from '@/api/avenir-esr'

export const ReceivedFeedbacksSectionStub = defineComponent({
  name: 'ReceivedFeedbacksSection',
  template: '<div data-testid="received-feedbacks-section-stub"></div>',
  props: {
    declaredActivityDetails: {
      type: Object as PropType<DeclaredActivityDetailsDTO>,
      required: true,
    },
  },
})
