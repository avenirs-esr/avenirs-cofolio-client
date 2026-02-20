import { ROUTES } from '@/common/constants'
import { projectActivitiesCatalogRoute, projectActivitiesDetailedRoute, projectActivitiesRoute } from '@/features/student/buildProject/routes'
import ProjectActivitiesCatalogView from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/ProjectActivitiesCatalogView.vue'
import ProjectActivitiesView from '@/features/student/buildProject/views/ProjectActivitiesView/ProjectActivitiesView.vue'
import ProjectActivityDetailedView from '@/features/student/buildProject/views/ProjectActivityDetailedView/ProjectActivityDetailedView.vue'
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

testRoute(
  projectActivitiesDetailedRoute,
  ROUTES.STUDENT.PROJECT_ACTIVITIES_DETAILED,
  ProjectActivityDetailedView
)
