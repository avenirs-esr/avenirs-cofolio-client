import type { AvRoute } from '@/common/types'
import { ROUTES } from '@/common/constants'

export const studentToolsTracesRoute: AvRoute = {
  ...ROUTES.STUDENT.TOOLS_TRACES,
  component: () =>
    import('@/features/student/traces/views/StudentToolsTracesView/StudentToolsTracesView.vue'),
}

export const studentTraceRoute: AvRoute = {
  ...ROUTES.STUDENT.TRACE,
  props: route => ({
    traceId: route.params.id,
  }),
  component: () =>
    import('@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'),
}
