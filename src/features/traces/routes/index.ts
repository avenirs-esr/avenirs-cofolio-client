import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const studentToolsTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () =>
    import('@/features/traces/views/StudentTraceView/StudentTraceView.vue'),
}

export const studentToolsTracesRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_TRACES,
  component: () =>
    import('@/features/traces/views/StudentToolsTracesView/StudentToolsTracesView.vue'),
}

export const studentTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () =>
    import('@/features/traces/views/StudentTraceView/StudentTraceView.vue'),
}

export const studentUpdateTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.UPDATE_TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () =>
    import('@/features/traces/views/StudentUpdateTraceView/StudentUpdateTraceView.vue'),
}

export const studentToolsUpdateTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_UPDATE_TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () =>
    import('@/features/traces/views/StudentUpdateTraceView/StudentUpdateTraceView.vue'),
}

export const studentToolsTracesRoutes: AvRoute[] = [
  studentToolsTraceRoute,
  studentToolsTracesRoute,
  studentToolsUpdateTraceRoute,
]

export const studentTracesRoutes: AvRoute[] = [
  studentTraceRoute,
  studentUpdateTraceRoute,
]
