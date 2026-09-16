import { studentSkillsRoute } from '@/features/student/skills/routes/index'
import StudentProjectSkillsView from '@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentSkillsRoute,
  {
    path: 'skills',
    name: 'student-skills',
  },
  StudentProjectSkillsView
)
