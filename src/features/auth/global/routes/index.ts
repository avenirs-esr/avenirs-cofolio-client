import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

const breadcrumb = [...BASE_BREADCRUMBS.AUTH.LOGIN]

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
          breadcrumb
        },
      },
      {
        ...ROUTES.AUTH.CGU,
        component: () =>
          import('@/common/views/CguView/CguView.vue'),
        meta: {
          breadcrumb
        },
      },
      {
        ...ROUTES.AUTH.COOKIES,
        component: () =>
          import('@/common/views/CookiesView/CookiesView.vue'),
        meta: {
          breadcrumb
        },
      },
      {
        ...ROUTES.AUTH.LOGIN,
        component: () => import('@/features/auth/global/views/LoginView/LoginView.vue'),
      },
      {
        ...ROUTES.AUTH.PERSONAL_DATA,
        component: () =>
          import('@/common/views/PersonalDataView/PersonalDataView.vue'),
        meta: {
          breadcrumb
        },
      },
    ]
  }
]
