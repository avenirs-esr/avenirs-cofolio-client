import { studentToolsKitRoute } from '@/features/kit/routes'
import StudentToolsKitView from '@/features/kit/views/StudentToolsKitView/StudentToolsKitView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentToolsKitRoute,
  {
    path: 'tools/kit',
    name: 'student-tools-kit',
  },
  StudentToolsKitView
)
