import { ROUTES } from '@/common/constants'

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
        component: () =>
          import('@/common/views/AccessibilityView/AccessibilityView.vue'),
      },
      {
        ...ROUTES.STAFF.COOKIES,
        component: () =>
          import('@/common/views/CookiesView/CookiesView.vue'),
      },
      {
        ...ROUTES.STAFF.LEGAL,
        component: () =>
          import('@/common/views/LegalView/LegalView.vue'),
      },
      {
        ...ROUTES.STAFF.PERSONAL_DATA,
        component: () =>
          import('@/common/views/PersonalDataView/PersonalDataView.vue'),
      },
      {
        ...ROUTES.STAFF.ACTIVITY_LIBRARY_ADD,
        component: () =>
          import('@/features/staff/activities/views/ActivitiesView/AddNationalActivityView.vue'),
      },
    ]
  }
]
