import { ROUTES } from '@/common/constants'
import { studentProjectDeclaredSkillRoute, studentUpdateDeclaredSkillRoute } from '@/features/student/declaredSkills/routes'
import StudentDeclaredSkillView from '@/features/student/declaredSkills/views/StudentDeclaredSkillView/StudentDeclaredSkillView.vue'
import StudentUpdateDeclaredSkillView from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/StudentUpdateDeclaredSkillView.vue'
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
