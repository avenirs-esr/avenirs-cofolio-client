import type { RoutePageProps } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { staffActivitiesEditNationalActivityRoute, staffActivitiesRoute, staffActivityCatalogRoute } from '@/features/staff/activities/routes'

const footerLegalProps: RoutePageProps = {
  backRoute: ROUTES.STAFF.HOME,
  breadcrumbLinksRaw: [
    { textKey: 'staff.global.navigation.tabs.home', to: ROUTES.STAFF.HOME },
  ]
}

export default [
  {
    path: '/staff',
    component: () => import('@/features/staff/global/layouts/StaffLayout/StaffLayout.vue'),
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
      staffActivitiesRoute,
      staffActivitiesEditNationalActivityRoute,
      staffActivityCatalogRoute
    ]
  }
]
