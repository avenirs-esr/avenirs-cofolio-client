import { studentToolsTracesRoute, studentTraceRoute } from '@/features/student/traces/routes'
import StudentToolsTracesView from '@/features/student/traces/views/StudentToolsTracesView/StudentToolsTracesView.vue'
import StudentTraceView from '@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentToolsTracesRoute,
  {
    path: 'tools/traces',
    name: 'student-tools-traces',
  },
  StudentToolsTracesView
)

testRoute(
  studentTraceRoute,
  {
    path: 'trace/:id',
    name: 'student-trace',
  },
  StudentTraceView
)
