import type { EFeedbackStatus } from '@/api/avenir-esr'
import type { UsePaginatedStaffFeedbacksParams } from '@/features/staff/feedbacks/composables/use-paginated-staff-feedbacks/use-paginated-staff-feedbacks'
import type { PropType } from 'vue'

export const FeedbacksTableStub = defineComponent({
  name: 'FeedbacksTable',
  template: '<div data-testid="feedbacks-table-stub"><slot name="actions" /></div>',
  props: {
    emptyStateMessage: String,
    selectedStatus: {
      type: String as PropType<'ALL' | EFeedbackStatus>,
      required: false,
    },
    usePaginatedStaffFeedbacksParams: {
      type: Object as PropType<UsePaginatedStaffFeedbacksParams>,
      required: true,
    },
  },
  emits: ['updateFeedbacksCount'],
})
