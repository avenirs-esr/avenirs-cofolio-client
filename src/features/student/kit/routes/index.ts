import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { BASE_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

export const studentToolsKitRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT,
  component: () => import('@/features/student/kit/views/StudentToolsKitView/StudentToolsKitView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.BASE],
  },
}
export const studentToolsKitTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () => import('@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.TRACES],
  },
}

export const studentToolsKitUpdateTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_KIT_UPDATE_TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () => import('@/features/student/traces/views/StudentUpdateTraceView/StudentUpdateTraceView.vue'),
  meta: {
    breadcrumb: [...BASE_BREADCRUMBS.STUDENT.TOOLS.KIT.TRACES],
  },
}
export const studentToolsKitRoutes: AvRoute[] = [studentToolsKitRoute, studentToolsKitTraceRoute, studentToolsKitUpdateTraceRoute]
