import type { FeedbackAssociatedElement } from '@/features/feedbacks/types/feedback.types'
import type { PropType } from 'vue'

export const AssociatedElementCardStub = defineComponent({
  name: 'AssociatedElementCard',
  template: '<div data-testid="associated-element-card-stub"></div>',
  props: {
    feedbackAssociatedElement: {
      type: Object as PropType<FeedbackAssociatedElement>,
      required: true,
    },
  },
})
