import { ROUTES } from '@/common/constants'
import { studentProjectDeclaredSkillRoute, studentUpdateDeclaredSkillRoute } from '@/features/declaredSkills/routes'
import StudentDeclaredSkillView from '@/features/declaredSkills/views/StudentDeclaredSkillView/StudentDeclaredSkillView.vue'
import StudentUpdateDeclaredSkillView from '@/features/declaredSkills/views/StudentUpdateDeclaredSkillView/StudentUpdateDeclaredSkillView.vue'
import { testRoute } from 'tests/utils'

testRoute(
  studentProjectDeclaredSkillRoute,
  ROUTES.STUDENT.PROJECT_DECLARED_SKILL,
  StudentDeclaredSkillView
)

testRoute(
  studentUpdateDeclaredSkillRoute,
  ROUTES.STUDENT.UPDATE_DECLARED_SKILL,
  StudentUpdateDeclaredSkillView
)
