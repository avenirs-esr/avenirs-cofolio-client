import { ROUTES } from '@/common/constants'
import { studentActivitiesCatalogRoute, studentActivitiesRoute, studentActivityRoute, studentWidgetActivityCatalogRoute, studentWidgetActivityRoute } from '@/features/student/activities/routes'
import ActivitiesCatalogView from '@/features/student/activities/views/ActivitiesCatalogView/ActivitiesCatalogView.vue'
import ActivitiesView from '@/features/student/activities/views/ActivitiesView/ActivitiesView.vue'
import ActivityView from '@/features/student/activities/views/ActivityView/ActivityView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentActivityRoute,
  ROUTES.STUDENT.ACTIVITY,
  ActivityView
)

testRoute(
  studentActivitiesRoute,
  ROUTES.STUDENT.ACTIVITIES,
  ActivitiesView
)

testRoute(
  studentActivitiesCatalogRoute,
  ROUTES.STUDENT.ACTIVITIES_CATALOG,
  ActivitiesCatalogView
)

testRoute(
  studentWidgetActivityRoute,
  ROUTES.STUDENT.WIDGET_ACTIVITY,
  ActivityView
)

testRoute(
  studentWidgetActivityCatalogRoute,
  ROUTES.STUDENT.WIDGET_ACTIVITY_CATALOG,
  ActivitiesCatalogView
)
