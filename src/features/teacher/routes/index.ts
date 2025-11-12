import { ROUTE_NAMES } from '@/common/constants'

export default [
  {
    path: '/teacher',
    component: () => import('@/features/teacher/global/layouts/TeacherLayout/TeacherLayout.vue'),
    children: [
      {
        ...ROUTE_NAMES.TEACHER.HOME,
        component: () =>
          import('@/features/teacher/global/views/TeacherHomeView/TeacherHomeView.vue'),
      },
      {
        ...ROUTE_NAMES.TEACHER.ACCESSIBILITY,
        component: () =>
          import('@/common/views/AccessibilityView/AccessibilityView.vue'),
      },
      {
        ...ROUTE_NAMES.TEACHER.COOKIES,
        component: () =>
          import('@/common/views/CookiesView/CookiesView.vue'),
      },
      {
        ...ROUTE_NAMES.TEACHER.LEGAL,
        component: () =>
          import('@/common/views/LegalView/LegalView.vue'),
      },
      {
        ...ROUTE_NAMES.TEACHER.PERSONNAL_DATA,
        component: () =>
          import('@/common/views/PersonnalDataView/PersonnalDataView.vue'),
      },
    ]
  }
]
