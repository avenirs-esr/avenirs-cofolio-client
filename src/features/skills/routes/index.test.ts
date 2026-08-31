import { studentProjectSkillsRoute } from '@/features/skills/routes/index'
import StudentProjectSkillsView from '@/features/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentProjectSkillsRoute,
  {
    path: 'project/skills',
    name: 'student-project-skills',
  },
  StudentProjectSkillsView
)
