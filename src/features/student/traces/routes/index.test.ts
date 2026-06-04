import { studentToolsTraceRoute, studentToolsTracesRoute, studentToolsUpdateTraceRoute, studentTraceRoute, studentUpdateTraceRoute } from '@/features/student/traces/routes'
import StudentToolsTracesView from '@/features/student/traces/views/StudentToolsTracesView/StudentToolsTracesView.vue'
import StudentTraceView from '@/features/student/traces/views/StudentTraceView/StudentTraceView.vue'
import StudentUpdateTraceView from '@/features/student/traces/views/StudentUpdateTraceView/StudentUpdateTraceView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentToolsTraceRoute,
  {
    path: 'tools/trace/:id',
    name: 'student-tools-trace',
  },
  StudentTraceView
)

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

testRoute(
  studentUpdateTraceRoute,
  {
    path: 'update-trace/:id',
    name: 'student-update-trace',
  },
  StudentUpdateTraceView
)

testRoute(
  studentToolsUpdateTraceRoute,
  {
    path: 'tools/update-trace/:id',
    name: 'student-tools-update-trace',
  },
  StudentUpdateTraceView
)
