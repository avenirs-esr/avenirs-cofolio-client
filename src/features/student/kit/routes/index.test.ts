import { studentToolsKitRoute } from '@/features/student/kit/routes'
import StudentToolsKitView from '@/features/student/kit/views/StudentToolsKitView/StudentToolsKitView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentToolsKitRoute,
  {
    path: 'tools/kit',
    name: 'student-tools-kit',
  },
  StudentToolsKitView
)
