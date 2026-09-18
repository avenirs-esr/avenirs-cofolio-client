import { ROUTES } from '@/common/constants'
import { projectBuildProjectRoute } from '@/features/student/buildProject/routes'
import StudentBuildProjectView from '@/features/student/global/views/StudentBuildProjectView/StudentBuildProjectView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  projectBuildProjectRoute,
  ROUTES.STUDENT.BUILD_PROJECT,
  StudentBuildProjectView
)
