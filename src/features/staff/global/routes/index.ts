import type { RoutePageProps } from '@/common/types'
import { EUserCategory } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { staffActivitiesRoutes } from '@/features/staff/activities/routes'
import { staffActivityFeedbacksRoute, staffStudentTrackingFeedbacksRoutes } from '@/features/staff/feedbacks/routes'

const footerLegalProps: RoutePageProps = {
  breadcrumbLinksRaw: [
    { textKey: 'staff.global.navigation.tabs.home', to: ROUTES.STAFF.HOME },
  ]
}

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
        props: () => footerLegalProps,
        component: () =>
          import('@/common/views/AccessibilityView/AccessibilityView.vue'),
      },
      {
        ...ROUTES.STAFF.COOKIES,
        props: () => footerLegalProps,
        component: () =>
          import('@/common/views/CookiesView/CookiesView.vue'),
      },
      {
        ...ROUTES.STAFF.LEGAL,
        props: () => footerLegalProps,
        component: () =>
          import('@/common/views/LegalView/LegalView.vue'),
      },
      {
        ...ROUTES.STAFF.PERSONAL_DATA,
        props: () => footerLegalProps,
        component: () =>
          import('@/common/views/PersonalDataView/PersonalDataView.vue'),
      },
      ...staffActivitiesRoutes,
      staffActivityFeedbacksRoute,
      ...staffStudentTrackingFeedbacksRoutes,
    ]
  }
]
