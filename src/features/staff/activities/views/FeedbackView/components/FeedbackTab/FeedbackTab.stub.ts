import type { UsePaginatedStaffFeedbacksParams } from '@/features/staff/activities/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks'
import type { PropType } from 'vue'

export const FeedbacksTabStub = defineComponent({
  name: 'FeedbacksTab',
  template: '<div data-testid="feedbacks-tab-stub"><slot name="actions" /></div>',
  props: {
    title: {
      type: String,
      required: true,
    },
    emptyStateMessage: String,
    usePaginatedStaffFeedbacksParams: {
      type: Object as PropType<UsePaginatedStaffFeedbacksParams>,
      required: true,
    },
  },
  emits: ['updateFeedbacksCount'],
})
