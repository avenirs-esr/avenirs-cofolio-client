import { studentAdditionalSkillRoute, studentUpdateAdditionalSkillRoute } from '@/features/student/additionalSkills/routes'
import StudentAdditionalSkillView from '@/features/student/additionalSkills/views/StudentAdditionalSkillView/StudentAdditionalSkillView.vue'
import StudentUpdateAdditionalSkillView from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/StudentUpdateAdditionalSkillView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentAdditionalSkillRoute,
  {
    path: 'additional-skill/:id',
    name: 'student-additional-skill',
  },
  StudentAdditionalSkillView
)

testRoute(
  studentUpdateAdditionalSkillRoute,
  {
    path: 'update-additional-skill/:id',
    name: 'student-update-additional-skill',
  },
  StudentUpdateAdditionalSkillView
)
