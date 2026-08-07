import { studentProjectSkillsRoute } from '@/features/student/skills/routes/index'
import StudentProjectSkillsView from '@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentProjectSkillsRoute,
  {
    path: 'project/skills',
    name: 'student-project-skills',
  },
  StudentProjectSkillsView
)
