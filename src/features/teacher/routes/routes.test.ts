import TeacherLayout from '@/features/teacher/layouts/TeacherLayout/TeacherLayout.vue'
import routes, { teacherHomeRoute } from '@/features/teacher/routes/routes'
import TeacherHomeView from '@/features/teacher/views/TeacherHomeView/TeacherHomeView.vue'
import { BddTest, testRoute } from 'tests/utils'

testRoute(
  teacherHomeRoute,
  {
    path: '',
    name: 'teacher-home',
  },
  TeacherHomeView
)

BddTest().given('the teacher root route', () => {
  const teacherRootRoute = routes.find(route => route.path === '/teacher')
  BddTest().when('getting the route', () => {
    BddTest().then('it should exist and have correct base config', () => {
      expect(teacherRootRoute).toBeDefined()
      expect(teacherRootRoute?.path).toBe('/teacher')
      expect(teacherRootRoute?.component).toBeDefined()
      expect(teacherRootRoute?.children).toEqual([
        teacherHomeRoute
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
