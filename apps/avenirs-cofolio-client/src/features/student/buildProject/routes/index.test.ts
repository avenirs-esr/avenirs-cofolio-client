import { testRoute } from 'tests/utils'
import { ROUTES } from '@/common/constants'
import { projectBuildProjectRoute } from '@/features/student/buildProject/routes'
import StudentBuildProjectView from '@/features/student/global/views/StudentBuildProjectView/StudentBuildProjectView.vue'

testRoute(
  projectBuildProjectRoute,
  ROUTES.STUDENT.BUILD_PROJECT,
  StudentBuildProjectView
)
