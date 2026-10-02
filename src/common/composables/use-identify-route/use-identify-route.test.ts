import { useIdentifyRoute } from '@/common/composables/use-identify-route/use-identitfy-route'
import { ROUTES } from '@/common/constants'
import { staffStudentTrackingFeedbacksRoutes } from '@/features/staff/feedbacks/routes'
import { studentToolsKitRoutes } from '@/features/student/kit/routes'
import { studentToolsTracesRoutes } from '@/features/student/traces/routes'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const route = reactive<{ name: string }>({
  name: ROUTES.STAFF.HOME.name
})

vi.mock('vue-router', () => ({
  useRoute: () => route
}))

BddTest().given('a useIdentifyRoute composable', () => {
  let useIdentifyRouteResult: ReturnType<typeof useIdentifyRoute>

  beforeEach(() => {
    route.name = ROUTES.STAFF.HOME.name
    useIdentifyRouteResult = useIdentifyRoute()
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('all expected properties should be returned', () => {
      expect(useIdentifyRouteResult).toHaveProperty('isStaffHomeRoute')
      expect(useIdentifyRouteResult).toHaveProperty('isStaffStudentTrackingRoute')
      expect(useIdentifyRouteResult).toHaveProperty('isStudentToolsTracesRoute')
      expect(useIdentifyRouteResult).toHaveProperty('isStudentToolsKitRoute')
    })

    BddTest().then('all route identifiers should be computed values', () => {
      expect(useIdentifyRouteResult.isStaffHomeRoute.value).toBe(true)
      expect(useIdentifyRouteResult.isStaffStudentTrackingRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsTracesRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsKitRoute.value).toBe(false)
    })
  })

  BddTest().when('the current route is the staff home route', () => {
    beforeEach(() => {
      route.name = ROUTES.STAFF.HOME.name
    })

    BddTest().then('isStaffHomeRoute should be true', () => {
      expect(useIdentifyRouteResult.isStaffHomeRoute.value).toBe(true)
    })

    BddTest().then('other route identifiers should be false', () => {
      expect(useIdentifyRouteResult.isStaffStudentTrackingRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsTracesRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsKitRoute.value).toBe(false)
    })
  })

  BddTest().when('the current route is not the staff home route', () => {
    beforeEach(() => {
      route.name = 'some-other-route'
    })

    BddTest().then('isStaffHomeRoute should be false', () => {
      expect(useIdentifyRouteResult.isStaffHomeRoute.value).toBe(false)
    })
  })

  BddTest().when('the current route belongs to staff student tracking routes', () => {
    beforeEach(() => {
      route.name = staffStudentTrackingFeedbacksRoutes[0].name
    })

    BddTest().then('isStaffStudentTrackingRoute should be true', () => {
      expect(useIdentifyRouteResult.isStaffStudentTrackingRoute.value).toBe(true)
    })

    BddTest().then('other route identifiers should be false', () => {
      expect(useIdentifyRouteResult.isStaffHomeRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsTracesRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsKitRoute.value).toBe(false)
    })
  })

  BddTest().when('the current route is a child of a student tools kit route', () => {
    beforeEach(() => {
      const parentRoute = studentToolsKitRoutes.find(
        routeItem => routeItem.children?.length
      )

      const childRouteName = parentRoute?.children?.[0]?.name

      expect(childRouteName).toBeDefined()
      route.name = childRouteName as string
    })

    BddTest().then('isStudentToolsKitRoute should be true', () => {
      expect(useIdentifyRouteResult.isStudentToolsKitRoute.value).toBe(true)
    })
  })

  BddTest().when('the current route belongs to student traces routes', () => {
    beforeEach(() => {
      route.name = studentToolsTracesRoutes[0].name
    })

    BddTest().then('isStudentToolsTracesRoute should be true', () => {
      expect(useIdentifyRouteResult.isStudentToolsTracesRoute.value).toBe(true)
    })

    BddTest().then('other route identifiers should be false', () => {
      expect(useIdentifyRouteResult.isStaffHomeRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStaffStudentTrackingRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsKitRoute.value).toBe(false)
    })
  })

  BddTest().when('the current route belongs to student kit routes', () => {
    beforeEach(() => {
      route.name = studentToolsKitRoutes[0].name
    })

    BddTest().then('isStudentToolsKitRoute should be true', () => {
      expect(useIdentifyRouteResult.isStudentToolsKitRoute.value).toBe(true)
    })

    BddTest().then('other route identifiers should be false', () => {
      expect(useIdentifyRouteResult.isStaffHomeRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStaffStudentTrackingRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsTracesRoute.value).toBe(false)
    })
  })

  BddTest().when('the current route does not belong to any identified route', () => {
    beforeEach(() => {
      route.name = 'unknown-route'
    })

    BddTest().then('all route identifiers should be false', () => {
      expect(useIdentifyRouteResult.isStaffHomeRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStaffStudentTrackingRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsTracesRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsKitRoute.value).toBe(false)
    })
  })

  BddTest().when('the current route changes', () => {
    BddTest().then('the route identifiers should update reactively', () => {
      route.name = ROUTES.STAFF.HOME.name

      expect(useIdentifyRouteResult.isStaffHomeRoute.value).toBe(true)
      expect(useIdentifyRouteResult.isStaffStudentTrackingRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsTracesRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsKitRoute.value).toBe(false)

      route.name = studentToolsKitRoutes[0].name

      expect(useIdentifyRouteResult.isStaffHomeRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsKitRoute.value).toBe(true)

      route.name = studentToolsTracesRoutes[0].name

      expect(useIdentifyRouteResult.isStudentToolsKitRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsTracesRoute.value).toBe(true)

      route.name = staffStudentTrackingFeedbacksRoutes[0].name

      expect(useIdentifyRouteResult.isStudentToolsTracesRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStaffStudentTrackingRoute.value).toBe(true)

      route.name = 'unknown-route'

      expect(useIdentifyRouteResult.isStaffHomeRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStaffStudentTrackingRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsTracesRoute.value).toBe(false)
      expect(useIdentifyRouteResult.isStudentToolsKitRoute.value).toBe(false)
    })
  })
})
