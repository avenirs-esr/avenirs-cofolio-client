import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'
import { META_BREADCRUMBS } from '@/common/constants/meta-breadcrumbs'

const TOOLS_TRACES_BREADCRUMBS = [
  META_BREADCRUMBS.STUDENT.HOME,
  META_BREADCRUMBS.STUDENT.TOOLS.DEFAULT,
  META_BREADCRUMBS.STUDENT.TOOLS.TRACES,
]

const TRACES_BREADCRUMBS = [
  META_BREADCRUMBS.STUDENT.HOME,
  { textKey: META_BREADCRUMBS.STUDENT.TOOLS.TRACES.textKey },
]

export const studentToolsTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () =>
    import('@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'),
  meta: {
    breadcrumb: [...TOOLS_TRACES_BREADCRUMBS],
  },
}

export const studentToolsTracesRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_TRACES,
  component: () =>
    import('@/features/student/traces/views/StudentToolsTracesView/StudentToolsTracesView.vue'),
  meta: {
    breadcrumb: [...TOOLS_TRACES_BREADCRUMBS],
  },
}

export const studentTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () =>
    import('@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'),
  meta: {
    breadcrumb: [...TRACES_BREADCRUMBS],
  },
}

export const studentUpdateTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.UPDATE_TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () =>
    import('@/features/student/traces/views/StudentUpdateTraceView/StudentUpdateTraceView.vue'),
  meta: {
    breadcrumb: [...TRACES_BREADCRUMBS],
  },
}

export const studentToolsUpdateTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_UPDATE_TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () =>
    import('@/features/student/traces/views/StudentUpdateTraceView/StudentUpdateTraceView.vue'),
  meta: {
    breadcrumb: [...TOOLS_TRACES_BREADCRUMBS],
  },
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
