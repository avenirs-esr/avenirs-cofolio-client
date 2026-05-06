import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const staffAddNationalActivityRoute: AvRoute = {
  ...ROUTES.STAFF.ACTIVITY_LIBRARY_ADD,
  component: () =>
    import('@/features/staff/activities/views/ActivitiesView/AddNationalActivityView.vue'),
}
