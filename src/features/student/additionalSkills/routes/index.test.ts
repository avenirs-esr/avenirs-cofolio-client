import { ROUTE_NAMES } from '@/common/constants'
import { studentAdditionalSkillRoute, studentUpdateAdditionalSkillRoute } from '@/features/student/additionalSkills/routes'
import StudentAdditionalSkillView from '@/features/student/additionalSkills/views/StudentAdditionalSkillView/StudentAdditionalSkillView.vue'
import StudentUpdateAdditionalSkillView from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/StudentUpdateAdditionalSkillView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentAdditionalSkillRoute,
  ROUTE_NAMES.STUDENT.ADDITIONAL_SKILL,
  StudentAdditionalSkillView
)

testRoute(
  studentUpdateAdditionalSkillRoute,
  ROUTE_NAMES.STUDENT.UPDATE_ADDITIONAL_SKILL,
  StudentUpdateAdditionalSkillView
)
