import type { AvRoute } from '@/common/types'
import type StudentToolsTracesView from '@/features/student/traces/views/StudentToolsTracesView/StudentToolsTracesView.vue'
import type StudentTraceView from '@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'

export const studentToolsTracesRoute: AvRoute = {
  path: 'tools/traces',
  name: 'student-tools-traces',
  component: () =>
    import('@/features/student/traces/views/StudentToolsTracesView/StudentToolsTracesView.vue') as Promise<{
      default: typeof StudentToolsTracesView
    }>,
}

export const studentTraceRoute: AvRoute = {
  path: 'trace/:id',
  name: 'student-trace',
  props: route => ({
    traceId: route.params.id,
  }),
  component: () =>
    import('@/features/student/traces/views/StudentTraceView/StudentTraceView.vue') as Promise<{
      default: typeof StudentTraceView
    }>,
}
