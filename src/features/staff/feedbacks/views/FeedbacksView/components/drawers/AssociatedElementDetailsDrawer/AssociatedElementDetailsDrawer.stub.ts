import type { FeedbackAssociatedElement } from '@/features/staff/feedbacks/types/feedback.types'
import type { PropType } from 'vue'

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
