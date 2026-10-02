import type { AvRoute } from '@/common/types/router.types'
import { ROUTES } from '@/common/constants'
import { staffStudentTrackingFeedbacksRoutes } from '@/features/staff/feedbacks/routes'
import { studentToolsKitRoutes } from '@/features/student/kit/routes'
import { studentToolsTracesRoutes } from '@/features/student/traces/routes'
import { useRoute } from 'vue-router'

/**
 * Identifies if the current route belongs to some route of interest.
 * @returns An object containing boolean computed properties for each route of interest.
 */
export function useIdentifyRoute () {
  const route = useRoute()

  function isRouteInRoutes (routes: AvRoute[]) {
    return routes.some(
      routeItem => routeItem.name === route.name
        || routeItem.children?.some(child => child.name === route.name)
    )
  }

  const isStaffHomeRoute = computed(() => route.name === ROUTES.STAFF.HOME.name)

  const isStaffStudentTrackingRoute = computed(() => isRouteInRoutes(staffStudentTrackingFeedbacksRoutes))

  const isStudentToolsTracesRoute = computed(() => isRouteInRoutes(studentToolsTracesRoutes))

  const isStudentToolsKitRoute = computed(() => isRouteInRoutes(studentToolsKitRoutes))

  return {
    isStaffHomeRoute,
    isStaffStudentTrackingRoute,
    isStudentToolsTracesRoute,
    isStudentToolsKitRoute,
  }
}
