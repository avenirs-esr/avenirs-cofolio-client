import { ROUTES } from '@/common/constants'
import { projectActivitiesCatalogRoute, projectActivitiesRoute } from '@/features/student/buildProject/routes'
import ProjectActivitiesCatalogView from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/ProjectActivitiesCatalogView.vue'
import ProjectActivitiesView from '@/features/student/buildProject/views/ProjectActivitiesView/ProjectActivitiesView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  projectActivitiesRoute,
  ROUTES.STUDENT.PROJECT_ACTIVITIES,
  ProjectActivitiesView
)

testRoute(
  projectActivitiesCatalogRoute,
  ROUTES.STUDENT.PROJECT_ACTIVITIES_CATALOG,
  ProjectActivitiesCatalogView
)
