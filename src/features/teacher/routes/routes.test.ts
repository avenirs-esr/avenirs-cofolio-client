import TeacherLayout from '@/features/teacher/layouts/TeacherLayout/TeacherLayout.vue'
import TeacherHomeView from '@/features/teacher/views/TeacherHomeView/TeacherHomeView.vue'
import { testRoute } from 'tests/utils'
import routes, { teacherHomeRoute } from './routes'

testRoute(
  teacherHomeRoute,
  {
    path: '',
    name: 'teacher-home',
  },
  TeacherHomeView
)

describe('teacher root route', () => {
  const teacherRootRoute = routes.find(route => route.path === '/teacher')

  it('should exist and have correct base config', () => {
    expect(teacherRootRoute).toBeDefined()
    expect(teacherRootRoute?.path).toBe('/teacher')
    expect(teacherRootRoute?.component).toBeDefined()
    expect(teacherRootRoute?.children).toEqual([
      teacherHomeRoute
    ])
  })

  it('should dynamically import TeacherLayout component', async () => {
    const componentLoader = teacherRootRoute?.component as () => Promise<{ default: unknown }>
    const componentModule = await componentLoader()
    expect(componentModule).toBeDefined()
    expect(componentModule.default).toBe(TeacherLayout)
  })
})
