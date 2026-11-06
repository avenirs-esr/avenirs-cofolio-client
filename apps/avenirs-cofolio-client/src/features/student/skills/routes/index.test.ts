import { testRoute } from '@avenirs-esr/shared/test-utils/unit'
import { studentSkillsRoute } from '@/features/student/skills/routes/index'
import StudentProjectSkillsView from '@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'

testRoute(
  studentSkillsRoute,
  {
    path: 'skills',
    name: 'student-skills',
  },
  StudentProjectSkillsView
)
