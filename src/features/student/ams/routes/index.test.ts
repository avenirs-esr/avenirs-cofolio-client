import { studentAmsRoute, studentEducationAmsRoute } from '@/features/student/ams/routes'
import StudentAmsView from '@/features/student/ams/views/StudentAmsView/StudentAmsView.vue'
import StudentEducationAmsView from '@/features/student/ams/views/StudentEducationAmsView/StudentEducationAmsView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentEducationAmsRoute,
  {
    path: 'education/activities',
    name: 'student-education-activities',
  },
  StudentEducationAmsView
)

testRoute(
  studentAmsRoute,
  {
    path: 'activity/:id',
    name: 'student-activity',
  },
  StudentAmsView
)
