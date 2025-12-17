import { ROUTES } from '@/common/constants'

export default [
  {
    path: '/teacher',
    component: () => import('@/features/teacher/global/layouts/TeacherLayout/TeacherLayout.vue'),
    children: [
      {
        ...ROUTES.TEACHER.HOME,
        component: () =>
          import('@/features/teacher/global/views/TeacherHomeView/TeacherHomeView.vue'),
      },
      {
        ...ROUTES.TEACHER.ACCESSIBILITY,
        component: () =>
          import('@/common/views/AccessibilityView/AccessibilityView.vue'),
      },
      {
        ...ROUTES.TEACHER.COOKIES,
        component: () =>
          import('@/common/views/CookiesView/CookiesView.vue'),
      },
      {
        ...ROUTES.TEACHER.LEGAL,
        component: () =>
          import('@/common/views/LegalView/LegalView.vue'),
      },
      {
        ...ROUTES.TEACHER.PERSONNAL_DATA,
        component: () =>
          import('@/common/views/PersonnalDataView/PersonnalDataView.vue'),
      },
    ]
  }
]
