import { ROUTES } from '@/common/constants'

export default [
  {
    path: `/auth`,
    component: () => import('@/features/auth/global/layouts/AuthLayout/AuthLayout.vue'),
    children: [
      {
        ...ROUTES.AUTH.ACCESSIBILITY,
        component: () =>
          import('@/common/views/AccessibilityView/AccessibilityView.vue'),
        meta: {
          public: true
        },
      },
      {
        ...ROUTES.AUTH.COOKIES,
        component: () =>
          import('@/common/views/CookiesView/CookiesView.vue'),
        meta: {
          public: true
        },
      },
      {
        ...ROUTES.AUTH.LEGAL,
        component: () =>
          import('@/common/views/LegalView/LegalView.vue'),
        meta: {
          public: true
        },
      },
      {
        ...ROUTES.AUTH.LOGIN,
        component: () => import('@/features/auth/global/views/LoginView/LoginView.vue'),
        meta: {
          public: true
        },
      },
      {
        ...ROUTES.AUTH.PERSONAL_DATA,
        component: () =>
          import('@/common/views/PersonalDataView/PersonalDataView.vue'),
        meta: {
          public: true
        },
      },
    ]
  }
]
