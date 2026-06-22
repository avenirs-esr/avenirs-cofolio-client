import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const staffStudentFeedbacksRoute: AvRoute = {
  ...ROUTES.STAFF.STUDENT_FEEDBACKS,
  component: () =>
    import('@/features/staff/feedbacks/views/FeedbacksView/FeedbacksView.vue'),
}
