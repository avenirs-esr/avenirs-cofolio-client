import { EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { staffActivitiesRoutes } from '@/features/staff/activities/routes'
import { staffActivityFeedbacksRoute, staffStudentTrackingFeedbacksRoutes } from '@/features/staff/feedbacks/routes'

const breadcrumb = [META_BREADCRUMBS.STAFF.HOME]

export default [
  {
    path: '/staff',
    component: () => import('@/features/staff/global/layouts/StaffLayout/StaffLayout.vue'),
    meta: {
      roles: [EUserCategory.STAFF]
    },
    children: [
      {
        ...ROUTES.STAFF.HOME,
        component: () =>
          import('@/features/staff/global/views/StaffHomeView/StaffHomeView.vue'),
      },
      {
        ...ROUTES.STAFF.ACCESSIBILITY,
        component: () =>
          import('@/common/views/AccessibilityView/AccessibilityView.vue'),
        meta: { breadcrumb },
      },
      {
        ...ROUTES.STAFF.COOKIES,
        component: () =>
          import('@/common/views/CookiesView/CookiesView.vue'),
        meta: { breadcrumb },
      },
      {
        ...ROUTES.STAFF.LEGAL,
        component: () =>
          import('@/common/views/LegalView/LegalView.vue'),
        meta: { breadcrumb },
      },
      {
        ...ROUTES.STAFF.PERSONAL_DATA,
        component: () =>
          import('@/common/views/PersonalDataView/PersonalDataView.vue'),
        meta: { breadcrumb },
      },
      ...staffActivitiesRoutes,
      staffActivityFeedbacksRoute,
      ...staffStudentTrackingFeedbacksRoutes,
    ]
  }
]
