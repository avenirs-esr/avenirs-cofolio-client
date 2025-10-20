import AccessibilityView from '@/common/views/AccessibilityView/AccessibilityView.vue'
import CookiesView from '@/common/views/CookiesView/CookiesView.vue'
import LegalView from '@/common/views/LegalView/LegalView.vue'
import PersonnalDataView from '@/common/views/PersonnalDataView/PersonnalDataView.vue'
import TeacherLayout from '@/features/teacher/layouts/TeacherLayout/TeacherLayout.vue'
import routes, { teacherAccessibilityRoute, teacherCookiesRoute, teacherHomeRoute, teacherLegalRoute, teacherPersonnalDataRoute } from '@/features/teacher/routes/routes'
import TeacherHomeView from '@/features/teacher/views/TeacherHomeView/TeacherHomeView.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { testRoute } from 'tests/utils'

testRoute(
  teacherHomeRoute,
  {
    path: '',
    name: 'teacher-home',
  },
  TeacherHomeView
)

testRoute(
  teacherAccessibilityRoute,
  {
    path: 'accessibility',
    name: 'teacher-accessibility',
  },
  AccessibilityView
)

testRoute(
  teacherCookiesRoute,
  {
    path: 'cookies',
    name: 'teacher-cookies',
  },
  CookiesView
)

testRoute(
  teacherLegalRoute,
  {
    path: 'legal',
    name: 'teacher-legal',
  },
  LegalView
)

testRoute(
  teacherPersonnalDataRoute,
  {
    path: 'personnal-data',
    name: 'teacher-personnal-data',
  },
  PersonnalDataView
)

BddTest().given('the teacher root route', () => {
  const teacherRootRoute = routes.find(route => route.path === '/teacher')
  BddTest().when('getting the route', () => {
    BddTest().then('it should exist and have correct base config', () => {
      expect(teacherRootRoute).toBeDefined()
      expect(teacherRootRoute?.path).toBe('/teacher')
      expect(teacherRootRoute?.component).toBeDefined()
      expect(teacherRootRoute?.children).toEqual([
        teacherHomeRoute,
        teacherAccessibilityRoute,
        teacherCookiesRoute,
        teacherLegalRoute,
        teacherPersonnalDataRoute
      ])
    })

    BddTest().then('it should dynamically import TeacherLayout component', async () => {
      const componentLoader = teacherRootRoute?.component as () => Promise<{ default: unknown }>
      const componentModule = await componentLoader()
      expect(componentModule).toBeDefined()
      expect(componentModule.default).toBe(TeacherLayout)
    })
  })
})
