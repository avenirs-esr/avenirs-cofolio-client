import { ROUTES } from '@/common/constants'
import { projectTrajectoriesRoute } from '@/features/student/buildProject/routes'
import StudentProjectTrajectoriesView from '@/features/student/global/views/StudentProjectTrajectoriesView/StudentProjectTrajectoriesView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  projectTrajectoriesRoute,
  ROUTES.STUDENT.PROJECT_TRAJECTORIES,
  StudentProjectTrajectoriesView
)
