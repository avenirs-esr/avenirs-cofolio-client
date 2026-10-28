import { EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'
import { ROUTE_ROLES } from '@/common/constants/route-roles'
import { withRequiredRoles } from '@/common/utils/route/route'
import { staffActivitiesRoutes } from '@/features/staff/activities/routes'
import { staffAdminRoutes } from '@/features/staff/admin/routes'
import { staffActivityAssessmentRoute } from '@/features/staff/assessments/routes'
import { staffActivityFeedbacksRoute, staffStudentTrackingFeedbacksRoutes } from '@/features/staff/feedbacks/routes'

const breadcrumb = [...BASE_BREADCRUMBS.STAFF.HOME.BASE]

export default [
  {
    path: '/staff',
    component: () => import('@/features/staff/global/layouts/StaffLayout/StaffLayout.vue'),
    meta: {
      roles: [EUserCategory.STAFF],
      cguRouteName: ROUTES.STAFF.CGU.name
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
      ...staffAdminRoutes,
      {
        ...ROUTES.STAFF.CGU,
        component: () =>
          import('@/common/views/CguView/CguView.vue'),
        meta: { breadcrumb },
      },
      {
        ...ROUTES.STAFF.COOKIES,
        component: () =>
          import('@/common/views/CookiesView/CookiesView.vue'),
        meta: { breadcrumb },
      },
      {
        ...ROUTES.STAFF.PERSONAL_DATA,
        component: () =>
          import('@/common/views/PersonalDataView/PersonalDataView.vue'),
        meta: { breadcrumb },
      },
      ...withRequiredRoles(ROUTE_ROLES.STAFF.ACTIVITIES, ...staffActivitiesRoutes),
      ...withRequiredRoles(ROUTE_ROLES.STAFF.ASSESSMENTS, staffActivityAssessmentRoute),
      ...withRequiredRoles(ROUTE_ROLES.STAFF.FEEDBACKS, staffActivityFeedbacksRoute, ...staffStudentTrackingFeedbacksRoutes),
    ]
  }
]
