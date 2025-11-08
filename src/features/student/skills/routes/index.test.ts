import { studentEducationSkillsRoute, studentProjectSkillsRoute, studentSkillRoute } from '@/features/student/skills/routes/index'
import StudentEducationSkillsView from '@/features/student/skills/views/StudentEducationSkillsView/StudentEducationSkillsView.vue'
import StudentProjectSkillsView from '@/features/student/skills/views/StudentProjectSkillsView/StudentProjectSkillsView.vue'
import StudentSkillView from '@/features/student/skills/views/StudentSkillView/StudentSkillView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentEducationSkillsRoute,
  {
    path: 'education/skills',
    name: 'student-education-skills',
  },
  StudentEducationSkillsView
)

testRoute(
  studentProjectSkillsRoute,
  {
    path: 'projects/skills',
    name: 'student-project-skills',
  },
  StudentProjectSkillsView
)

testRoute(
  studentSkillRoute,
  {
    path: 'skill/:id',
    name: 'student-skill',
  },
  StudentSkillView
)
