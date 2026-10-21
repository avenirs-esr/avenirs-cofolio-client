import type { PropType } from 'vue'
import type { FeedbackAssociatedElement } from '@/features/staff/feedbacks/types/feedback.types'

export const AssociatedElementDetailsDrawerStub = defineComponent({
  name: 'AssociatedElementDetailsDrawer',
  template: '<div data-testid="associated-element-details-drawer-stub"></div>',
  props: {
    feedbackAssociatedElement: {
      type: Object as PropType<FeedbackAssociatedElement>,
      required: true,
    },
  },
  emits: ['close'],
})
