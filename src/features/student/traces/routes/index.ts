import type { AvRoute } from '@/common/types'
import { ROUTE_NAMES } from '@/common/constants'

export const studentToolsTracesRoute: AvRoute = {
  ...ROUTE_NAMES.STUDENT.TOOLS_TRACES,
  component: () =>
    import('@/features/student/traces/views/StudentToolsTracesView/StudentToolsTracesView.vue'),
}

export const studentTraceRoute: AvRoute = {
  ...ROUTE_NAMES.STUDENT.TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () =>
    import('@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'),
}
