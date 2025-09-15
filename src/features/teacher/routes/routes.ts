import type AccessibilityView from '@/common/views/AccessibilityView/AccessibilityView.vue'
import type CookiesView from '@/common/views/CookiesView/CookiesView.vue'
import type LegalView from '@/common/views/LegalView/LegalView.vue'
import type PersonnalDataView from '@/common/views/PersonnalDataView/PersonnalDataView.vue'
import type TeacherLayout from '@/features/teacher/layouts/TeacherLayout/TeacherLayout.vue'
import type TeacherHomeView from '@/features/teacher/views/TeacherHomeView/TeacherHomeView.vue'
import type { RouteRecordRaw } from 'vue-router'

export const teacherHomeRoute = {
  path: '',
  name: 'teacher-home',
  component: () =>
    import('@/features/teacher/views/TeacherHomeView/TeacherHomeView.vue') as Promise<{
      default: typeof TeacherHomeView
    }>,
}

export const teacherAccessibilityRoute = {
  path: 'accessibility',
  name: 'teacher-accessibility',
  component: () =>
    import('@/common/views/AccessibilityView/AccessibilityView.vue') as Promise<{
      default: typeof AccessibilityView
    }>,
}

export const teacherCookiesRoute = {
  path: 'cookies',
  name: 'teacher-cookies',
  component: () =>
    import('@/common/views/CookiesView/CookiesView.vue') as Promise<{
      default: typeof CookiesView
    }>,
}

export const teacherLegalRoute = {
  path: 'legal',
  name: 'teacher-legal',
  component: () =>
    import('@/common/views/LegalView/LegalView.vue') as Promise<{
      default: typeof LegalView
    }>,
}

export const teacherPersonnalDataRoute = {
  path: 'personnal-data',
  name: 'teacher-personnal-data',
  component: () =>
    import('@/common/views/PersonnalDataView/PersonnalDataView.vue') as Promise<{
      default: typeof PersonnalDataView
    }>,
}

const routes: RouteRecordRaw[] = [
  {
    path: '/teacher',
    component: () => import('@/features/teacher/layouts/TeacherLayout/TeacherLayout.vue') as Promise<{
      default: typeof TeacherLayout
    }>,
    children: [
      teacherHomeRoute,
      teacherAccessibilityRoute,
      teacherCookiesRoute,
      teacherLegalRoute,
      teacherPersonnalDataRoute
    ]
  }
]

export default routes
