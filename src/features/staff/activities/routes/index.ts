import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const staffActivitiesRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITIES,
  component: () =>
    import('@/features/staff/activities/views/ActivitiesView/ActivitiesView.vue'),
}
