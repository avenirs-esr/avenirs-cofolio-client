import { studentEducationSkillRoute, studentEducationSkillsRoute, studentProjectSkillRoute, studentProjectSkillsRoute, studentSkillRoute } from '@/features/student/skills/routes/index'
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
  studentEducationSkillRoute,
  {
    path: 'education/skill/:id',
    name: 'student-education-skill',
  },
  StudentSkillView
)

testRoute(
  studentProjectSkillsRoute,
  {
    path: 'project/skills',
    name: 'student-project-skills',
  },
  StudentProjectSkillsView
)

testRoute(
  studentProjectSkillRoute,
  {
    path: 'project/skill/:id',
    name: 'student-project-skill',
  },
  StudentSkillView
)

testRoute(
  studentSkillRoute,
  {
    path: 'skill/:id',
    name: 'student-skill',
  },
  StudentSkillView
)
