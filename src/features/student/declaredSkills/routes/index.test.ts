import { testRoute } from 'tests/utils'
import { ROUTES } from '@/common/constants'
import { studentProjectDeclaredSkillRoute, studentUpdateDeclaredSkillRoute } from '@/features/student/declaredSkills/routes'
import StudentDeclaredSkillView from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/StudentDeclaredSkillView.vue'
import StudentUpdateDeclaredSkillView from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/StudentUpdateDeclaredSkillView.vue'

testRoute(
  studentProjectDeclaredSkillRoute,
  ROUTES.STUDENT.DECLARED_SKILL,
  StudentDeclaredSkillView
)

testRoute(
  studentUpdateDeclaredSkillRoute,
  ROUTES.STUDENT.UPDATE_DECLARED_SKILL,
  StudentUpdateDeclaredSkillView
)
