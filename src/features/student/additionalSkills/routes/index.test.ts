import { ROUTES } from '@/common/constants'
import { studentAdditionalSkillRoute, studentUpdateAdditionalSkillRoute } from '@/features/student/additionalSkills/routes'
import StudentAdditionalSkillView from '@/features/student/additionalSkills/views/StudentAdditionalSkillView/StudentAdditionalSkillView.vue'
import StudentUpdateAdditionalSkillView from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/StudentUpdateAdditionalSkillView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentAdditionalSkillRoute,
  ROUTES.STUDENT.ADDITIONAL_SKILL,
  StudentAdditionalSkillView
)

testRoute(
  studentUpdateAdditionalSkillRoute,
  ROUTES.STUDENT.UPDATE_ADDITIONAL_SKILL,
  StudentUpdateAdditionalSkillView
)
